import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getAbout {
        _id
        aboutpage {
          title
          desc
          readmorelink
          worklist
          contactlink
        }
      }
  }`;

const UPDATE_LINK_MUTATION = gql`
  mutation Mutation($id: String!, $input: AboutInput) {
    updateAbout(_id: $id, input: $input) {
        aboutpage {
        title
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
        title: '',
        desc: "",
        readmorelink: "",
        contactlink: "",
        worklist: [
            { list: '' }
        ]
    };

    const [optionSection, setOptionSection] = React.useState(initialstate);
    
    const handleInput = (index: any, event, name) => {
        let data = { ...optionSection };
        const worklist = [...optionSection.worklist];

        switch (name) {
            case 'aboutSection':
                const worklistData = { ...worklist[index] }
                worklistData[event.target.name] = event.target.value;
                worklist[index] = worklistData
                break;
            default:
                break;
        }
        setOptionSection({ ...data, worklist });
    }

    const handlesingleInput = (event, names) => {

        const datainput = { ...optionSection };
        switch (names) {
            case 'hometitle':
                datainput[event.target.name] = event.target.value;
                break;
            case 'desc':
                datainput[event.target.name] = event.target.value;
                break;
            case 'Readmorelink':
                datainput[event.target.name] = event.target.value;
                break;
            case 'contactlink':
                datainput[event.target.name] = event.target.value;
                break;
            default:
                break;
        }
        setOptionSection(datainput);
    }

    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'aboutSection':
                setOptionSection(({ ...optionSection, worklist: [...optionSection.worklist, { list: '' }] }));
                break;
            default:
                break;
        }
    }
    
    const inputData = [
        {
            title: optionSection.title,
            desc: optionSection.desc,
            readmorelink: optionSection.readmorelink,
            contactlink: optionSection.contactlink,
            worklist: [
                ...optionSection.worklist
            ],
        }
    ]

    // console.log(inputData,'inputdata')
    // debugger;
    let { loading, data } = useQuery(GET_VIEWER)
    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
       
        variables: {
            "input": {
                "aboutpage": inputData
            },
            "id": optionSection._id,
        }
    });

    useEffect(() => {
        if (data) {
            // console.log(data,'datasss')

            // setTimeout(() =>
            // setOptionSection(
            //     {
            //         title: data.getAbout[0].title,
            //         desc: data.getAbout[0].desc,
            //         readmorelink: data.getAbout[0].readmorelink,
            //         contactlink: data.getAbout[0].contactlink,
            //         worklist: data.getAbout[0].worklist,
            //         _id: data.getAbout[0]._id
            //     }
            // )
            // , 500);
        }

    }, [loading]);

    // const { error, data, loading } = useQuery(GET_VIEWER);

    // useEffect(() => {
    //     if (data) {
    //         setOptionSection(({
    //             _id: data.getAbout[0]._id,
    //             aboutSection:
    //             {
    //                 title: data.getAbout[0].aboutpage[0].title,
    //                 image1: data.getAbout[0].aboutpage[0].image1,
    //                 image2: data.getAbout[0].aboutpage[0].image2,
    //                 worklist: [
    //                     ...data.getAbout[0].aboutpage[0].worklist
    //                 ],
    //                 desc: data.getAbout[0].aboutpage[0].desc,
    //                 readmorelink: data.getAbout[0].aboutpage[0].readmorelink,
    //                 contactlink: data.getAbout[0].aboutpage[0].contactlink
    //             }
    //         }))
    //     }
    // }, [data]);
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Home page</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    // if (optionSection && optionSection._id) {
                        updateLink();
                    // }
                }}>
                    <strong>About Section</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>Title</label>
                            <input type="text"
                                name='title'
                                className="form-control"
                                value={optionSection.title}
                                onChange={event => handlesingleInput(event, 'hometitle')}
                                placeholder="Title" />
                            <label>Description</label>
                            <textarea
                                name='desc'
                                value={optionSection.desc}
                                className="form-control"
                                onChange={event => handlesingleInput(event, 'desc')}
                                placeholder="Desc" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-5">
                            <label className="control-label">Readmore link</label>
                            <input type="url"
                                name='readmorelink'
                                value={optionSection.readmorelink}
                                className="form-control"
                                placeholder="Readmorelink" onChange={event => handlesingleInput(event, 'Readmorelink')} />
                        </div>
                        <div className="form-group col-5">
                            <label className="control-label">Contact Link</label>
                            <input type="url"
                                name='contactlink'
                                value={optionSection.contactlink}
                                className="form-control"
                                placeholder="Contactlink" onChange={event => handlesingleInput(event, 'contactlink')} />
                        </div>
                    </div>
                    {optionSection.worklist.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-group">
                                        {index === 0 ? <label>List</label> : null}
                                        <input type="text"
                                            name='list'
                                            value={input.list}
                                            onChange={event => handleInput(index, event, 'aboutSection')}
                                            className="form-control"
                                            placeholder="list" />
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === optionSection.worklist.length - 1 &&
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