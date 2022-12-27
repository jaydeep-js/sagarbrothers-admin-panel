import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getHeader {
        _id
        time
        email
        location
        logo
        inquiryemail
        contact
        socialicon {
          iconlink
          icon
        }
        menubar {
          menulink
          menuname
        }
      }
  }`;
const CREATE_LINK_MUTATION = gql`
mutation Mutation($input: HeaderInput) {
    addHeader(input: $input) {
      time
      email
      location
      logo
      inquiryemail
      contact
      socialicon {
        icon
        iconlink
      }
      menubar {
        menulink
        menuname
      }
      _id
    }
  }
`;
const UPDATE_LINK_MUTATION = gql`
mutation Mutation($id: String!, $input: HeaderInput) {
    updateHeader(_id: $id, input: $input) {
      menubar {
        menulink
        menuname
      }
      socialicon {
        iconlink
        icon
      }
      contact
      inquiryemail
      logo
      location
      email
      time
      _id
    }
  }
  `;

export const Form: React.FC = () => {
    const initialstate = {
        _id: '',
        time: '',
        email: '',
        location: '',
        logo: '',
        inquiryemail: '',
        contact: '',
        socialicon: [{
            icon: '',
            iconlink: ''
        }],
        menubar: [{
            menulink: '',
            menuname: '',
        }]
    };

    const [mainFields, setmainFields] = React.useState(initialstate);
    const handlesingleInput = (event, names) => {
        const datainput = { ...mainFields };

        switch (names) {
            case 'time':
                datainput[event.target.name] = event.target.value;
                break;
            case 'email':
                datainput[event.target.name] = event.target.value;
                break;
            case 'location':
                datainput[event.target.name] = event.target.value;
                break;
            case 'InquiryEmail':
                datainput[event.target.name] = event.target.value;
                break;
            case 'contact':
                datainput[event.target.name] = event.target.value;
                break;
            case 'fileupload':
                datainput[event.target.name] = event.target.files[0].name
                break;
            default:
                break;
        }
        setmainFields(datainput);
    }

    const handleChangeInput = (index: any, event: React.ChangeEvent<HTMLInputElement>, name) => {
        let data = { ...mainFields };
        const menubar = [...mainFields.menubar];
        const socialicon = [...mainFields.socialicon];
        switch (name) {
            case 'Menu':
                const menuData = {...menubar[index]}
                menuData[event.target.name] = event.target.value;
                menubar[index] = menuData
                break;
            case 'socialicon':
                const socialData = { ...socialicon[index] }
                socialData[event.target.name] = event.target.value;
                socialicon[index] = socialData
                break;
            default:
                break;
        }
        setmainFields({...data, menubar,socialicon });
    }

    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'menu':
                setmainFields(({ ...mainFields, menubar: [...mainFields.menubar, { menuname: '', menulink: '' }] }));
                break;
            case 'socialicon':
                setmainFields(({ ...mainFields, socialicon: [...mainFields.socialicon, { icon: '', iconlink: '' }] }));
                break;
            default:
                break;
        }
    }

    const inputData = {
        time: mainFields.time,
        email: mainFields.email,
        location: mainFields.location,
        logo: mainFields.logo,
        inquiryemail: mainFields.inquiryemail,
        contact: parseInt(mainFields.contact),
        socialicon: [
            ...mainFields.socialicon
        ],
        menubar: [
            ...mainFields.menubar
        ]
    }
    let { loading, data } = useQuery(GET_VIEWER)

    const [createLink,{ loading: submitLoading }] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            "input": inputData
        },
        fetchPolicy: 'no-cache'
    });

    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": inputData,
            "id": mainFields._id
        },
    });
    useEffect(() => {
        if (data) {
            setmainFields(
                {
                    time: data.getHeader[0].time,
                    email: data.getHeader[0].email,
                    location: data.getHeader[0].location,
                    logo: data.getHeader[0].logo,
                    inquiryemail: data.getHeader[0].inquiryemail,
                    contact: data.getHeader[0].contact,
                    socialicon: data.getHeader[0].socialicon,
                    menubar: data.getHeader[0].menubar,
                    _id: data.getHeader[0]._id
                }
            )
        }

    }, [loading,submitLoading]);

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Header Forms</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (mainFields && mainFields._id) {
                        updateLink();
                    } else {
                        createLink();
                    }
                }}>
                    <strong>Time</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>Time</label>
                            <textarea
                                name='time'
                                value={mainFields.time}
                                onChange={event => handlesingleInput(event, 'time')}
                                className="form-control" placeholder="Enter TIme" />
                        </div>
                    </div>
                    <strong>email</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>email</label>
                            <input type="text"
                                name='email'
                                value={mainFields.email}
                                onChange={event => handlesingleInput(event, 'email')}
                                className="form-control mr-3"
                                placeholder="email" />
                        </div>
                    </div>
                    <strong>location</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>location</label>
                            <textarea
                                name='location'
                                value={mainFields.location}
                                onChange={event => handlesingleInput(event, 'location')}
                                className="form-control" placeholder="Enter location" />
                        </div>
                    </div>

                    <strong>Inquiry Email</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>Inquiry Email</label>
                            <textarea
                                name='inquiryemail'
                                value={mainFields.inquiryemail}
                                onChange={event => handlesingleInput(event, 'InquiryEmail')}
                                className="form-control" placeholder="Enter Inquiry Email" />
                        </div>
                    </div>

                    <strong>contact</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>contact</label>
                            <input type="text"
                                name='contact'
                                value={mainFields.contact}
                                onChange={event => handlesingleInput(event, 'contact')}
                                className="form-control mr-3"
                                placeholder="contact" />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-10">
                            <div className="form-group">
                                <label >Logo</label>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" name="logo"
                                        onChange={event => handlesingleInput(event, 'fileupload')}
                                    />
                                    <label className="custom-file-label form-control" >Choose file</label>
                                </div>
                            </div>
                            {mainFields.logo === '' ? null :
                                <div className="form-group">
                                    <img src={'assets/img/' + mainFields.logo} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                                </div>
                            }
                        </div>
                    </div>
                    <strong >menubar</strong>
                    {mainFields.menubar.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label>menu Name</label> : null}
                                            <input type="text"
                                                name='menuname'
                                                // value={mainFields.menubar[index].menuname}
                                                value={input.menuname}
                                                onChange={event => handleChangeInput(index, event, 'Menu')}
                                                className="form-control mr-3"
                                                placeholder="MenuName" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label> Link</label> : null}
                                            <input type="text"
                                                name='menulink'
                                                // value={mainFields.menubar[index].menulink}
                                                value={input.menulink}
                                                onChange={event => handleChangeInput(index, event, 'Menu')}
                                                className="form-control mr-3"
                                                placeholder="MenuLink" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === mainFields.menubar.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("menu")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <strong >socialicon</strong>
                    {mainFields.socialicon.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label>icon</label> : null}
                                            <input type="text"
                                                name='icon'
                                                value={input.icon}
                                                onChange={event => handleChangeInput(index, event, 'socialicon')}
                                                className="form-control mr-3"
                                                placeholder="icon" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label> Link</label> : null}
                                            <input type="text"
                                                name='iconlink'
                                                value={input.iconlink}
                                                onChange={event => handleChangeInput(index, event, 'socialicon')}
                                                className="form-control mr-3"
                                                placeholder="Link" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === mainFields.socialicon.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("socialicon")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <button type="submit" disabled={submitLoading} className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
