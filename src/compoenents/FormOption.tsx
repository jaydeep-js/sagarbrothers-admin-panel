import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getAbout {
        _id
        aboutpage {
          title
          image1
          image2
          desc
          readmorelink
          worklist
          contactlink
        }
      }
  }`
const UPDATE_LINK_MUTATION = gql`
  mutation Mutation($id: String!, $input: AboutInput) {
    updateAbout(_id: $id, input: $input) {
        aboutpage {
        title
        image1
        image2
        desc
        readmorelink
        worklist
        contactlink
      }
      _id
    }
  }
  `;

export const FormOption: React.FC = () => {
    const initialstate = {
        _id: '',
        aboutSection:
        {
            title: '',
            image1: "",
            image2: "",
            worklist: [],
            desc: "",
            readmorelink: "",
            contactlink: ""
        }
    };
    const [optionSection, setOptionSection] = React.useState(initialstate);

    const handleInput = (index: any, event, name) => {
        const data = { ...optionSection };
        switch (name) {
            case 'aboutSection':
                data.aboutSection.worklist[index][event.target.name] = event.target.value;
                break;
            default:
                break;
        }
        setOptionSection(data);
    }
    const handlesingleInput = (event, names) => {
       
        const datainput = { ...optionSection };
        switch (names) {
            case 'hometitle':
                datainput.aboutSection[event.target.name] = event.target.value;
                break;
            case 'homeimage1':
                datainput.aboutSection[event.target.name] = event.target.files[0].name
                break;
            case 'homeimage2':
                datainput.aboutSection[event.target.name] = event.target.files[0].name
                break;
            case 'desc':
                datainput.aboutSection[event.target.name] = event.target.value;
                break;
            case 'Readmorelink':
                datainput.aboutSection[event.target.name] = event.target.value;
                break;
            case 'contactlink':
                datainput.aboutSection[event.target.name] = event.target.value;
                break;
            default:
                break;
        }
        setOptionSection(datainput);
    }
    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'aboutSection':
                setOptionSection(({ ...optionSection, aboutSection: { ...optionSection.aboutSection, worklist: [...optionSection.aboutSection.worklist, ''] } }));
                break;
            default:
                break;
        }
    }
    const inputData = [
        {
            title: optionSection.aboutSection.title,
            image1: optionSection.aboutSection.image1,
            image2: optionSection.aboutSection.image2,
            desc: optionSection.aboutSection.desc,
            readmorelink: optionSection.aboutSection.readmorelink,
            worklist: optionSection.aboutSection.worklist,
            contactlink: optionSection.aboutSection.contactlink,
        }
    ]

    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": {
                "aboutpage": inputData
            },
            "id": optionSection._id,
        }

    });

    const { error, data, loading } = useQuery(GET_VIEWER);
    useEffect(() => {
        
        if (data) {
            
            setOptionSection(({
                _id: data.getAbout[0]._id,
                aboutSection:
                {
                    title: data.getAbout[0].aboutpage[0].title,
                    image1: data.getAbout[0].aboutpage[0].image1,
                    image2: data.getAbout[0].aboutpage[0].image2,
                    worklist: [
                        ...data.getAbout[0].aboutpage[0].worklist
                    ],
                    desc: data.getAbout[0].aboutpage[0].desc,
                    readmorelink: data.getAbout[0].aboutpage[0].readmorelink,
                    contactlink: data.getAbout[0].aboutpage[0].contactlink
                }
            }))
        }
    }, [data]);
    
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Home page</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (optionSection && optionSection._id) {
                        updateLink();
                    }
                }}>
                    <strong>About Section</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>Title</label>
                            <input type="text"
                                name='title'
                                className="form-control"
                                value={optionSection.aboutSection.title}
                                onChange={event => handlesingleInput(event, 'hometitle')}
                                placeholder="Title" />
                            <label>Description</label>
                            <textarea
                                name='desc'
                                value={optionSection.aboutSection.desc}
                                className="form-control"
                                onChange={event => handlesingleInput(event, 'desc')}
                                placeholder="Desc" />
                        </div>
                        <div className="form-group col-10">
                            <label>Image 1</label>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" name="image1" onChange={event => handlesingleInput(event, 'homeimage1')} />
                                <label className="custom-file-label form-control" >Choose file</label>
                            </div>
                        </div>
                        {optionSection.aboutSection.image1 === '' ? null :
                            <div className="form-group col-10">
                                <img src={'assets/img/' + optionSection.aboutSection.image1} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                            </div>
                        }

                        <div className="form-group col-10">
                            <label>Image 2</label>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" name="image2" onChange={event => handlesingleInput(event, 'homeimage2')} />
                                <label className="custom-file-label form-control" >Choose file</label>
                            </div>
                        </div>
                        {optionSection.aboutSection.image2 === '' ? null :
                            <div className="form-group col-10">
                                <img src={'assets/img/' + optionSection.aboutSection.image2} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                            </div>
                        }
                    </div>
                    
                    <div className="row">
                        <div className="form-group col-5">
                            <label className="control-label">Readmore link</label>
                            <input type="url"
                                name='readmorelink'
                                value={optionSection.aboutSection.readmorelink}
                                className="form-control"
                                placeholder="Readmorelink" onChange={event => handlesingleInput(event, 'Readmorelink')} />
                        </div>

                        <div className="form-group col-5">
                            <label className="control-label">Contact Link</label>
                            <input type="url"
                                name='contactlink'
                                value={optionSection.aboutSection.contactlink}
                                className="form-control"
                                placeholder="Contactlink" onChange={event => handlesingleInput(event, 'contactlink')} />
                        </div>
                    </div>
                    <strong>List</strong>
                    {optionSection.aboutSection.worklist.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-group">
                                        {index === 0 ? <label>List</label> : null}
                                        <input type="text"
                                            name='worklist'
                                            value={input}
                                            onChange={event => handleInput(index, event, 'aboutSection')}
                                            className="form-control"
                                            placeholder="list" />
                                    </div>
                                </div>

                                <div className="col-2">
                                    {index === optionSection.aboutSection.worklist.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("aboutSection")} className="form-control bg-success text-white">+</button>
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
