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
const UPDATE_LINK_MUTATION = gql`
mutation Mutation($id: String!, $input: AboutInput) {
  updateAbout(_id: $id, input: $input) {
    achievement {
      title
      icon
      number
    }
    _id
  }
}
`;
export const FormAbout: React.FC = () => {

    const initialstate = {
        _id: '',
        Achievements: [
            { icon: '', number: '', title: '' }
        ]
    };
    const [aboutSection, setAboutSection] = React.useState(initialstate);

    const handleChangeInput = (index: any, event: React.ChangeEvent<HTMLInputElement>, name) => {
        // const data = { ...aboutSection };
        
        let data = { ...aboutSection };

        const Achievements = [...aboutSection.Achievements];
        switch (name) {
            case 'Achievements':
                const AchievementsData = {...Achievements[index]}
                AchievementsData[event.target.name] = event.target.value;
                Achievements[index] = AchievementsData
                break;
                // data.Achievements[index][event.target.name] = event.target.value;
                // break;
            default:
                break;
        }
        setAboutSection({...data, Achievements });
        // setAboutSection(data);
    }
    const inputData = [
        ...aboutSection.Achievements,
    ]

    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'Achievements':
                setAboutSection(({ ...aboutSection, Achievements: [...aboutSection.Achievements, { icon: '', number: '', title: '' }] }));
                break;
            default:
                break;
        }
    }

    const { loading, data } = useQuery(GET_VIEWER)
    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "id": aboutSection._id,
            "input": {
                "achievement": inputData[0] == null ? setAboutSection(({ ...aboutSection, Achievements: [...aboutSection.Achievements, { icon: '', number: '', title: '' }] })) : inputData
            }
        }
    });
    
    useEffect(() => {
        if (data) {
            setTimeout(() =>
                setAboutSection(({
                    ...aboutSection, Achievements:
                        data.getAbout[0].achievement, _id: data.getAbout[0]._id
                }))
                , 500);
        }

    }, [loading]);

    return (
        <div>
            <h4 className="card-title">About Page</h4>
            <form className="mt-4" onSubmit={(e) => {
                e.preventDefault();
                if (aboutSection && aboutSection._id) {
                    updateLink();
                }
            }}>
                <strong>Achievements</strong>
                {aboutSection.Achievements.map((input, index) => {
                    return (
                        <div className="row align-items-end mt-2" key={index}>
                            <div className="col">
                                <div className="form-row">
                                    <div className="form-group col-4">
                                        {index === 0 ? <label>Icon</label> : null}
                                        <input type="text"
                                            name='icon'
                                            value={input.icon}
                                            onChange={event => handleChangeInput(index, event, 'Achievements')}
                                            className="form-control"
                                            placeholder="Icon" required />
                                    </div>
                                    <div className="form-group col-4">
                                        {index === 0 ? <label>Number</label> : null}
                                        <input type="text"
                                            name='number'
                                            value={input.number}
                                            onChange={event => handleChangeInput(index, event, 'Achievements')}
                                            className="form-control"
                                            placeholder="Enter Number" required />
                                    </div> 
                                    <div className="form-group col-4">
                                        {index === 0 ? <label>Title</label> : null}
                                        <input type="text"
                                            name='title'
                                            value={input.title}
                                            onChange={event => handleChangeInput(index, event, 'Achievements')}
                                            className="form-control"
                                            placeholder="Enter Title" required />
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                {index === aboutSection.Achievements.length - 1 &&
                                    <div className="form-group">
                                        <button onClick={() => addFields("Achievements")} className="form-control bg-success text-white">+</button>
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

