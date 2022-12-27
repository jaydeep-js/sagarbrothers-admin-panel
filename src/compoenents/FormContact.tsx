import React from "react";
import * as L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';

const GET_VIEWER = gql`query{
  getContact {
    _id
    title
    subtitle
    address
    lat
    lng
    infotitle
    desc
    ContactInfo {
      link
      icon
      title
    text
    }
    Info {
      name
      Infotype
      Infoclassname
    }
  }
}`;
const CREATE_LINK_MUTATION = gql`
mutation Mutation($input: ContactInput) {
  addContact(input: $input) {
    desc
    infotitle
    lng
    lat
    address
    subtitle
    title
    ContactInfo {
      link
      icon
      text
      title
    }
    Info {
      Infoclassname
      name
      Infotype
    }
  }
}
`;
const UPDATE_LINK_MUTATION = gql`
mutation Mutation($input: FooterInput, $id: String!) {
  updateContact(_id: $id, input: $input) {
    ContactInfo {
      link
      icon
      text
      title
    }
    Info {
      Infoclassname
      name
      Infotype
    }
    desc
    infotitle
    lng
    lat
    address
    subtitle
    title
  }
  }
  `;
export const FormContact: React.FC = () => {

  const initialstate = {
    _id: '',
    contact: {
      title: { title: '' }, subtitle: { subtitle: '' }
    },
    Info: [
      { name: '', Infotype: '', Infoclassname: '' }
    ],
    map: {
      address: { address: '' }, lat: { lat: 51.505 }, lng: { lng: -0.127 }
    },
    ContactInfo: {
      infotitle: { infotitle: '' }, desc: { desc: '' },
      "contactresult": [{ icon: '', link: '', title: '', text: '' }]
    }
  };
  const [contactsection, setContactSection] = React.useState(initialstate);
  const handleInput = (index: any, event, name) => {
    const data = { ...contactsection };
    switch (name) {
      case 'contactform':
        data.Info[index][event.target.name] = event.target.value;
        break;
      case 'ContactInfo':
        data.ContactInfo.contactresult[index][event.target.name] = event.target.value;
        break;
      default:
        break;
    }
    setContactSection(data);
  }
  
  const handlesingleInput = (event, names) => {
    const datainput = { ...contactsection };
    switch (names) {
      case 'title':
        datainput.contact.title[event.target.name] = event.target.value;
        break;
      case 'subtitle':
        datainput.contact.subtitle[event.target.name] = event.target.value;
        break;
      case 'address':
        datainput.map.address[event.target.name] = event.target.value;
        break;
      case 'latitude':
        datainput.map.lat[event.target.name] = event.target.value;
        break;
      case 'longitude':
        datainput.map.lng[event.target.name] = event.target.value;
        break;
      case 'infotitle':
        datainput.ContactInfo.infotitle[event.target.name] = event.target.value;
        break;
      case 'desc':
        datainput.ContactInfo.desc[event.target.name] = event.target.value;
        break;
      default:
        break;
    }
    setContactSection(datainput);
  }

  const addFields = (fieldName) => {
    switch (fieldName) {
      case 'contactform':
        setContactSection(({ ...contactsection, Info: [...contactsection.Info, { name: '', Infotype: '', Infoclassname: '' }] }));
        break;
      case 'ContactInfo':
        setContactSection(({
          ...contactsection, ContactInfo: {
            ...contactsection.ContactInfo,
            "contactresult": [...contactsection.ContactInfo.contactresult, { icon: '', link: '', title: '', text: '' }]
          }
        }))
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    (async () => {
      try {
        await map()
      } catch (e) {
      }
    })();
  }, []);

  const map = () => {
    var tileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
    });

    var map = new L.Map('map', {
      'center': [contactsection.map.lat.lat, contactsection.map.lng.lng],
      'zoom': 12,
      'layers': [tileLayer]
    });
    var marker = L.marker([contactsection.map.lat.lat, contactsection.map.lng.lng], {
      draggable: true,
      autoPan: true
    }).addTo(map);

    marker.on('dragend', function (e) {
      setContactSection(({ ...contactsection, map: { ...contactsection.map, lat: { lat: marker.getLatLng().lat }, lng: { lng: marker.getLatLng().lng } } }));
    });

    map.on('click', function (e) {
      marker.setLatLng(e.latlng);
      setContactSection(({ ...contactsection, map: { ...contactsection.map, lat: { lat: marker.getLatLng().lat }, lng: { lng: marker.getLatLng().lng } } }));
    });
    const searchControl = GeoSearchControl({
      style: 'bar',
      provider: new OpenStreetMapProvider({
      }),
      autoClose: true,
    });
    map.addControl(searchControl);
  };
  const inputData = {

    desc: contactsection.ContactInfo.desc.desc,
    infotitle: contactsection.ContactInfo.infotitle.infotitle,
    lng: contactsection.map.lng.lng,
    lat: contactsection.map.lat.lat,
    address: contactsection.map.address.address,
    subtitle: contactsection.contact.subtitle.subtitle,
    title: contactsection.contact.title.title,
    ContactInfo: [
      ...contactsection.ContactInfo.contactresult
    ],
    Info: [
      ...contactsection.Info
    ]
  }
  const { loading, data, error } = useQuery(GET_VIEWER)
  const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
    variables: {
      "input": inputData,
      "id": contactsection._id
    },
  });
  useEffect(() => {
    if (data) {
      setContactSection(({
        ...contactsection, map: {
          ...contactsection.map,
          address: { address: data.getContact[0].address },
          lat: { lat: data.getContact[0].lat }, lng: { lng: data.getContact[0].lng }
        },
        contact: {
          ...contactsection.contact,
          title: { title: data.getContact[0].title },
          subtitle: { subtitle: data.getContact[0].subtitle }
        },
        ContactInfo: {
          ...contactsection.ContactInfo,
          infotitle: { infotitle: data.getContact[0].infotitle },
          desc: { desc: data.getContact[0].desc },
          contactresult: data.getContact[0].ContactInfo
        },
        Info: [
          ...data.getContact[0].Info
        ]
      }));
    }

  }, [data]);
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      "input": inputData
    },
  });
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Contact Page</h4>
        <form className="mt-4" onSubmit={(e) => {
          e.preventDefault();
          if (contactsection && contactsection._id) {
            updateLink();
          } else {
            createLink();
          }
        }}>
          <div className="row">
            <div className="form-group col-5">
              <label>Title</label>
              <input type="text"
                name='title'
                value={contactsection.contact.title.title}
                onChange={event => handlesingleInput(event, 'title')}
                className="form-control"
                placeholder="Title" required />
            </div>
            <div className="form-group col-5">
              <label>Sub Title</label>
              <input type="text"
                name='subtitle'
                value={contactsection.contact.subtitle.subtitle}
                onChange={event => handlesingleInput(event, 'subtitle')}
                className="form-control"
                placeholder="Sub title" required />
            </div>
          </div>
          <strong>Contact Form</strong>
          {contactsection.Info.map((input, index) => {
            return (
              <div className="row align-items-end mt-2" key={index}>
                <div className="col">
                  <div className="row">
                    <div className="form-group col-6" >
                      {index === 0 ? <label>Name</label> : null}
                      <input type="text"
                        name='name'
                        value={input.name}
                        onChange={event => handleInput(index, event, 'contactform')}
                        className="form-control"
                        placeholder="Name" required />
                    </div>
                    <div className="form-group col-6" >
                      {index === 0 ? <label>Type</label> : null}
                      <input type="text"
                        name='Infotype'
                        value={input.Infotype}
                        onChange={event => handleInput(index, event, 'contactform')}
                        className="form-control"
                        placeholder="Type" required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col">
                      {index === 0 ? <label>Classname</label> : null}
                      <input type="text"
                        name='Infoclassname'
                        value={input.Infoclassname}
                        onChange={event => handleInput(index, event, 'contactform')}
                        className="form-control"
                        placeholder="Classname" required />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  {index === contactsection.Info.length - 1 &&
                    <div className="form-group">
                      <button onClick={() => addFields("contactform")} className="form-control bg-success text-white">+</button>
                    </div>
                  }
                </div>
              </div>
            )
          })}
          <strong>Map</strong>
          <div className="row mt-2">
            <div className="form-group col-4">
              <label>Address</label>
              <input type="text"
                name='address'
                value={contactsection.map.address.address}
                onChange={event => handlesingleInput(event, 'address')}
                className="form-control mr-3 mb-3"
                placeholder="Address" required />
            </div>
            <div className="form-group col-3">
              <label>latitude</label>
              <input type="text"
                name='latitude'
                value={contactsection.map.lat.lat}
                onChange={event => handlesingleInput(event, 'latitude')}
                className="form-control mr-3 mb-3"
                placeholder="Latitude" required />
            </div>
            <div className="form-group col-3">
              <label>Longitude</label>
              <input type="text"
                name='longitude'
                value={contactsection.map.lng.lng}
                onChange={event => handlesingleInput(event, 'longitude')}
                className="form-control mr-3 mb-3"
                placeholder="Longitude" required />
            </div>
          </div>
          <div className="form-row" >
            <div className="form-group col-10" >
              <div id="map" style={{ height: '400px', zIndex: '1' }} ></div>
            </div>
          </div>
          <div className="form-row mt-2" >
            <div className="form-group col-10" >
              <label>Title</label>
              <input type="text"
                name='infotitle'
                value={contactsection.ContactInfo.infotitle.infotitle}
                onChange={event => handlesingleInput(event, 'infotitle')}
                className="form-control"
                placeholder="Title" required />
              <label>Description</label>
              <textarea
                name='desc'
                value={contactsection.ContactInfo.desc.desc}
                onChange={event => handlesingleInput(event, 'desc')}
                className="form-control"
                placeholder="Desc" required />
            </div>
          </div>
          <strong>Contact Info</strong>
          {contactsection.ContactInfo.contactresult.map((input, index) => {
            return (
              <div className="row align-items-end" key={index}>
                <div className="col">
                  <div className="row">
                    <div className="form-group col-3" >
                      {index === 0 ? <label>Title</label> : null}
                      <input type="text"
                        name='title'
                        value={input.title}
                        onChange={event => handleInput(index, event, 'ContactInfo')}
                        className="form-control"
                        placeholder="Title" required />
                    </div>
                    <div className="form-group col-3" >
                      {index === 0 ? <label>Text</label> : null}
                      <input type="text"
                        name='text'
                        value={input.text}
                        onChange={event => handleInput(index, event, 'ContactInfo')}
                        className="form-control"
                        placeholder="Text" required />
                    </div>
                    <div className="form-group col-3" >
                      {index === 0 ? <label>Icon</label> : null}
                      <input type="text"
                        name='icon'
                        value={input.icon}
                        onChange={event => handleInput(index, event, 'ContactInfo')}
                        className="form-control"
                        placeholder="Icon" required />
                    </div>

                    <div className="form-group col-3" >
                      {index === 0 ? <label>Link</label> : null}
                      <input type="text"
                        name='link'
                        value={input.link}
                        onChange={event => handleInput(index, event, 'ContactInfo')}
                        className="form-control"
                        placeholder="Link" required />
                    </div>

                  </div>
                </div>
                <div className="col-2">
                  {index === contactsection.ContactInfo.contactresult.length - 1 &&
                    <div className="form-group">
                      <button onClick={() => addFields("ContactInfo")} className="form-control bg-success text-white">+</button>
                    </div>
                  }
                </div>
              </div>

            )
          })}
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}



















