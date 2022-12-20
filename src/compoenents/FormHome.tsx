import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';

const GET_VIEWER = gql`query{
    getHome {
        _id
        title {
          maintitle
          year
          desc
          readmorelink
          discoverlink
        }
        functionality {
            readmorelink
            desc
            maintitle
            image
          }
        testimonials {
          icon
          name
          desc
          category
        }
      }
  }`

const CREATE_LINK_MUTATION = gql`
mutation AddHome($input: HomeInput) {
    addHome(input: $input) {
      _id
      title {
        year
        maintitle
        desc
        readmorelink
        discoverlink
      }
      functionality {
        readmorelink
        desc
        maintitle
        image
      }
      testimonials {
        category
        desc
        name
        icon
        _id
      }
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
mutation Mutation($id: String!, $input: HomeInput) {
    updateHome(_id: $id, input: $input) {
      title {
        discoverlink
        readmorelink
        desc
        maintitle
        year
        _id
      }
      testimonials {
        category
        desc
        name
        icon
        _id
      }
      functionality {
        readmorelink
        desc
        maintitle
        image
      }
    }
  }
`;

export const FormHome: React.FC = () => {
    const initialstate = {
        _id: '',
        title: [
            { year: '', maintitle: '', desc: '', readmorelink: '', discoverlink: '' }
        ],
        testimonials: [
            { icon: '', name: '', desc: '', category: '' }
        ],
        functionality: [
            { image: '', desc: '', readmorelink: '', maintitle: '' }
        ]
    };

    const [mainSection, setMainSection] = React.useState(initialstate);
    const [isRequired, setIsRequired] = React.useState(true);
    const [isNewItem, setIsNewItem] = React.useState(true);

    const handleInput = (index: any, event, name) => {
        let data = { ...mainSection };

        const title = [...mainSection.title];
        const testimonials = [...mainSection.testimonials];
        const functionality = [...mainSection.functionality];

    // debugger;
        switch (name) {
            case 'homesection':
                const titleData = {...title[index]}
                titleData[event.target.name] = event.target.value;
                title[index] = titleData
                break;
            // case 'mainimage':
            //     data.homeSection[index][event.target.name] = URL.createObjectURL(event.target.files[0]);
            //     break;
            case 'worksection':
                const functionalityData = {...functionality[index]}
                functionalityData[event.target.name] = event.target.value;
                functionality[index] = functionalityData
                break;
            case 'workimage':
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.readAsDataURL(file);
             
                const obj = {...functionality[index]}
                reader.onloadend = () => {
                  const arrayBuffer = reader.result;
                  obj[event.target.name] = arrayBuffer;
                  functionality[index] = obj
                  setMainSection({...data, functionality, testimonials });
                };
              
                break;
            case 'Testimonials':
                const testimonialsData = {...testimonials[index]}
                testimonialsData[event.target.name] = event.target.value;
                testimonials[index] = testimonialsData
                break;
            case 'testimonialimage':
                const file1 = event.target.files[0];

                const reader1 = new FileReader();
                reader1.readAsDataURL(file1);
             
                reader1.onloadend = () => {
                  const arrayBuffer = reader1.result;
                  const obj = {...testimonials[index]}
                  obj[event.target.name] = arrayBuffer;
                  testimonials[index] = obj
                  setMainSection({...data, functionality, testimonials });
                };
                break;
            default:
                break;
        }
     
        setMainSection({...data, title, functionality, testimonials });
    }

    const inputData = {
        title: [
            ...mainSection.title
        ],
        testimonials: [
            ...mainSection.testimonials
        ],
        functionality: [
            ...mainSection.functionality
        ]
    }
    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'homesection':
                setMainSection(({ ...mainSection, title: [...mainSection.title, { year: '', maintitle: '', desc: '', readmorelink: '', discoverlink: '' }] }));
                break;
            case 'worksection':
                setMainSection(({ ...mainSection, functionality: [...mainSection.functionality, { image: '', desc: '', readmorelink: '', maintitle: '' }] }));
                break;
            case 'Testimonials':
                setMainSection(({ ...mainSection, testimonials: [...mainSection.testimonials, { icon: '', name: '', desc: '', category: '' }] }));
                break;
            default:
                break;
        }
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
            "id": mainSection._id,
        },
    });

    useEffect(() => {
        if (mainSection && mainSection._id) {
            setIsRequired(false)
            setIsNewItem(false)
        } 
        if (data && data.getHome && data.getHome.length) {
                setMainSection(
                    {
                        title: [
                            ...data.getHome[0].title
                        ],
                        testimonials: [
                            ...data.getHome[0].testimonials
                        ],
                        functionality: [
                            ...data.getHome[0].functionality
                        ],
                        _id: data.getHome[0]._id
                })
        }
    }, [loading, mainSection._id, submitLoading]);

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Home page</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (isNewItem) {
                        createLink().then(({data})=>{
                            if (data && data.addHome) {
                                setMainSection({...mainSection, _id: data.addHome._id })
                            }
                        });
                    } else {
                        updateLink();
                    }
                }}>
                    <strong>Main Section</strong>
                    {mainSection.title.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    {index === 0 ? null :
                                        <strong>{'Screen:' + index}</strong>
                                    }
                                    <div className="form-row">
                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>maintitle</label> : null}
                                            <input type="text"
                                                name='maintitle'
                                                value={input.maintitle}
                                                onChange={event => handleInput(index, event, 'homesection')}
                                                className="form-control"
                                                placeholder="Title" required />
                                        </div>
                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>year</label> : null}
                                            <input type="text"
                                                name='year'
                                                value={input.year}
                                                onChange={event => handleInput(index, event, 'homesection')}
                                                className="form-control"
                                                placeholder="year" required />
                                        </div>
                                    </div>
                                    <div className="form-group" >
                                        {index === 0 ? <label>Description</label> : null}
                                        <textarea
                                            name='desc'
                                            value={input.desc}
                                            className="form-control"
                                            onChange={event => handleInput(index, event, 'homesection')}
                                            placeholder="Desc" required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>Readmore link</label> : null}
                                            <input type="url"
                                                name='readmorelink'
                                                value={input.readmorelink}
                                                onChange={event => handleInput(index, event, 'homesection')}
                                                className="form-control"
                                                placeholder="Readmorelink" required />
                                        </div>
                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>Discover Link</label> : null}
                                            <input type="url"
                                                name='discoverlink'
                                                value={input.discoverlink}
                                                onChange={event => handleInput(index, event, 'homesection')}
                                                className="form-control"
                                                placeholder="Discoverlink" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === mainSection.title.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("homesection")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <strong >Work Section</strong>
                    {mainSection.functionality.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    {index === 0 ? null :
                                        <strong>{'Screen:' + index}</strong>
                                    }
                                    <div className="form-group">
                                        {index === 0 ? <label>icon</label> : null}
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="image" onChange={event => handleInput(index, event, 'workimage')} required={isRequired} />
                                            <label className="custom-file-label form-control" >Choose file</label>
                                        </div>
                                    </div>
                                    {mainSection.functionality[index].image === '' ? null :
                                        <div className="form-group">
                                            <img src={mainSection.functionality[index].image } alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                                        </div>
                                    }
                                    <div className="form-group">
                                        {index === 0 ? <label>Title</label> : null}
                                        <input type="text"
                                            name='maintitle'
                                            value={input.maintitle}
                                            onChange={event => handleInput(index, event, 'worksection')}
                                            className="form-control"
                                            placeholder="Title" required />
                                    </div>
                                    <div className="form-group">
                                        {index === 0 ? <label>Description</label> : null}
                                        <textarea
                                            name='desc'
                                            value={input.desc}
                                            className="form-control"
                                            onChange={event => handleInput(index, event, 'worksection')}
                                            placeholder="Description" required />
                                    </div>
                                    <div className="form-group">
                                        {index === 0 ? <label>Readmore link</label> : null}
                                        <input type="text"
                                            name='readmorelink'
                                            value={input.readmorelink}
                                            onChange={event => handleInput(index, event, 'worksection')}
                                            className="form-control"
                                            placeholder="Readmorelink" required />
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === mainSection.functionality.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("worksection")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>

                            </div>
                        )
                    })}
                    <strong>Testimonials</strong>
                    {mainSection.testimonials.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    {index === 0 ? null :
                                        <strong>{'Screen:' + index}</strong>
                                    }
                                    <div className="form-group">
                                        {index === 0 ? <label>Icon</label> : null}
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="icon" onChange={event => handleInput(index, event, 'testimonialimage')}  required={isRequired} />
                                            <label className="custom-file-label form-control" >Choose file</label>

                                        </div>
                                    </div>
                                    {mainSection.testimonials[index].icon === '' ? null :
                                        <div className="form-group">
                                            <img src={ mainSection.testimonials[index].icon} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />
                                        </div>
                                    }
                                    <div className="form-group" >
                                        {index === 0 ? <label>Description</label> : null}
                                        <textarea
                                            name='desc'
                                            value={input.desc}
                                            className="form-control"
                                            onChange={event => handleInput(index, event, 'Testimonials')}
                                            placeholder="Desc" required />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>Name</label> : null}
                                            <input type="text"
                                                name='name'
                                                value={input.name}
                                                onChange={event => handleInput(index, event, 'Testimonials')}
                                                className="form-control"
                                                placeholder="Name" required />
                                        </div>

                                        <div className="form-group col-6" >
                                            {index === 0 ? <label>Profession</label> : null}
                                            <input type="text"
                                                name='category'
                                                value={input.category}
                                                onChange={event => handleInput(index, event, 'Testimonials')}
                                                className="form-control"
                                                placeholder="Testimonials" required />
                                        </div>

                                    </div>
                                </div>

                                <div className="col-2">
                                    {index === mainSection.testimonials.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("Testimonials")} className="form-control bg-success text-white">+</button>
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
