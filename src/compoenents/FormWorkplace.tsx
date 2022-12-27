import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getAbout {
        _id
        aboutpage {
          _id
          worklist
        }
        achievement {
          _id
          title
          icon
          number
        }
        workplace {
          name
          desc
          image
          readmorelink
          contactuslink
          bestworkplace
        }
      }
  }`

const CREATE_LINK_MUTATION = gql`
mutation Mutation($input: AboutInput) {
    addAbout(input: $input) {
      workplace {
        name
        desc
        image
        readmorelink
        contactuslink
      }
    }
  }
`;
const UPDATE_LINK_MUTATION = gql`
mutation Mutation($id: String!, $input: AboutInput) {
    updateAbout(_id: $id, input: $input) {
    workplace {
        name
        desc
        image
        readmorelink
        contactuslink
        bestworkplace
      }
      _id
    }
  }
`;
export const FormWorkplace: React.FC = () => {

    const initialstate = {
        _id: '',
        workplace: [
            { name: '', desc: '', image: '', readmorelink: '', contactuslink: '' }
        ]
    };
    const [workplaceSection, setworPlaceSection] = React.useState(initialstate);
    const [isRequired, setIsRequired] = React.useState(true);
    const [isNewItem, setIsNewItem] = React.useState(true);

    const handleInput = (index: any, event, name) => {
        let data = { ...workplaceSection };

        const workplace = [...workplaceSection.workplace];

        switch (name) {
            case 'WorkPlace':
                const workplaceData = { ...workplace[index] }
                workplaceData[event.target.name] = event.target.value;
                workplace[index] = workplaceData

                break;
            case 'workplaceimage':
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.readAsDataURL(file);

                const obj = { ...workplace[index] }
                reader.onloadend = () => {
                    const arrayBuffer = reader.result;
                    obj[event.target.name] = arrayBuffer;
                    workplace[index] = obj
                    setworPlaceSection({ ...data, workplace });
                };
                break;
            default:
                break;
        }
        setworPlaceSection({ ...data, workplace });
    }

    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'WorkPlace':
                setworPlaceSection(({ ...workplaceSection, workplace: [...workplaceSection.workplace, { name: '', desc: '', image: '', readmorelink: '', contactuslink: '' }] }));
                break;
            default:
                break;
        }
    }

    const inputData = {

        workplace: [
            ...workplaceSection.workplace
        ]
    }

    const [createLink, { loading: submitLoading }] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            "input": inputData
        },
        fetchPolicy: 'no-cache'
    });

    let { loading, data } = useQuery(GET_VIEWER)
    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": inputData,
            "id": workplaceSection._id
        },
    });

    useEffect(() => {
        if (workplaceSection && workplaceSection._id) {
            setIsRequired(false)
            setIsNewItem(false)
        }
        if (data && data.getAbout && data.getAbout.length) {
            setTimeout(() =>
                setworPlaceSection(({
                    ...workplaceSection, workplace:
                        data.getAbout[0].workplace, _id: data.getAbout[0]._id

                })), 1000);
        }
    }, [loading, workplaceSection._id, submitLoading]);
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Workplace Page</h4>
                <form className="mt-4" onSubmit={(e) => {

                    e.preventDefault();
                    if (isNewItem) {
                        createLink().then(({ data }) => {
                            if (data && data.addAbout) {
                                setworPlaceSection({ ...workplaceSection, _id: data.addAbout._id })
                            }
                        });
                    } else {
                        updateLink();
                    }
                }}>
                    {workplaceSection.workplace.map((input, index) => {
                        return (
                            <div className="row align-items-end" key={index} >
                                <div className="col">
                                    <div className="form-group" >
                                        {index === 0 ? <label>name</label> : null}
                                        <input type="text"
                                            name='name'
                                            value={input.name}
                                            onChange={event => handleInput(index, event, 'WorkPlace')}
                                            className="form-control"
                                            placeholder="name" />
                                    </div>
                                    <div className="form-group">
                                        {index === 0 ? <label>Description</label> : null}
                                        <textarea
                                            name='desc'
                                            value={input.desc}
                                            className="form-control"
                                            onChange={event => handleInput(index, event, 'WorkPlace')}
                                            placeholder="Description" />
                                    </div>
                                    <div className="form-group">
                                        {index === 0 ? <label>Image</label> : null}
                                        <div className="custom-file mb-3">
                                            <input type="file" className="custom-file-input" name="image" onChange={event => handleInput(index, event, 'workplaceimage')} />
                                            <label className="custom-file-label form-control" >Choose file</label>

                                        </div>
                                    </div>
                                    {workplaceSection.workplace[index].image === '' ? null :
                                        <div className="form-group">
                                            <img src={workplaceSection.workplace[index].image} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="form-group col-6">
                                            {index === 0 ? <label>Readmore link</label> : null}
                                            <input type="url"
                                                name='readmorelink'
                                                value={input.readmorelink}
                                                onChange={event => handleInput(index, event, 'WorkPlace')}
                                                className="form-control"
                                                placeholder="Readmore link" />
                                        </div>
                                        <div className="form-group col-6">
                                            {index === 0 ? <label>Contact Link</label> : null}
                                            <input type="url"
                                                name='contactuslink'
                                                value={input.contactuslink}
                                                onChange={event => handleInput(index, event, 'WorkPlace')}
                                                className="form-control"
                                                placeholder="ContactUsLink" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === workplaceSection.workplace.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("WorkPlace")} className="form-control bg-success text-white">+</button>
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