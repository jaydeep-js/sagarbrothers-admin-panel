import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getFooter {
        _id
        logo
        address
        contact
        inquiryemail
        aboutinformation
        customercare {
          pagename
          pagelink
        }
        navigate {
          link
          name
        }
        contactforestimate
        readmorelink
        copyrightby
      }
  }`;
const CREATE_LINK_MUTATION = gql`
mutation Mutation($input: FooterInput) {
    addFooter(input: $input) {
      address
      inquiryemail
      aboutinformation
      navigate {
        link
        name
      }
      customercare {
        pagename
        pagelink
      }
      contactforestimate
      readmorelink
      copyrightby
    }
}
`;

const UPDATE_LINK_MUTATION = gql`
mutation Mutation($input: FooterInput, $id: String!) {
    updateFooter(input: $input, _id: $id) {
      _id
      logo
      address
      contact
      inquiryemail
      aboutinformation
      customercare {
        pagelink
        pagename
      }
      copyrightby
      readmorelink
      contactforestimate
      navigate {
        link
        name
      }
    }
  }
  `;

export const FormFooter: React.FC = () => {
    const initialstate = {
        _id: '',
        address: '',
        inquiryemail: "",
        aboutinformation: "",
        navigate: [
            { name: '', link: '' }
        ],
        customercare: [
            { pagename: '', pagelink: '' }
        ],
        contactforestimate: "",
        readmorelink: "",
        copyrightby: ""
    };
    const [footerFields, setFooterFields] = React.useState(initialstate);
    const handleInput = (index: any, event: React.ChangeEvent<HTMLInputElement>, name) => {

        // const data = { ...footerFields };
        let data = { ...footerFields };
        const navigate = [...footerFields.navigate];
        const customercare = [...footerFields.customercare];

        switch (name) {
            case 'customercare':
                const customercareData = { ...customercare[index] }
                customercareData[event.target.name] = event.target.value;
                customercare[index] = customercareData
                // data.customercare[index][event.target.name] = event.target.value;
                break;
            case 'navigate':
                const navigateData = { ...navigate[index] }
                navigateData[event.target.name] = event.target.value;
                navigate[index] = navigateData
                // data.navigate[index][event.target.name] = event.target.value;
                break;
            default:
                break;
        }

        setFooterFields({...data, customercare, navigate });
    }
    const handlesingleInput = (event, names) => {
        const datainput = { ...footerFields };
        switch (names) {
            case 'fileupload':
                datainput[event.target.name] = URL.createObjectURL(event.target.files[0]);
                break;
            case 'Estimatetext':
                datainput[event.target.name] = event.target.value;
                break;
            case 'EstimateNumber':
                datainput[event.target.name] = event.target.value;
                break;
            case 'Readmorelink':
                datainput[event.target.name] = event.target.value;
                break;
            case 'copytext':
                datainput[event.target.name] = event.target.value;
                break;
            case 'address':
                datainput[event.target.name] = event.target.value;
                break;
            default:
                break;
        }
        setFooterFields(datainput);
    }
    const addFields = (fieldName) => {
        switch (fieldName) {
            case 'customercare':
                setFooterFields(({ ...footerFields, customercare: [...footerFields.customercare, { pagename: '', pagelink: '' }] }));
                break;
            case 'navigate':
                setFooterFields(({ ...footerFields, navigate: [...footerFields.navigate, { name: '', link: '' }] }));
                break;
            default:
                break;
        }
    }
    const inputData = {
        address: footerFields.address,
        navigate: [
            ...footerFields.navigate
        ],
        customercare: [
            ...footerFields.customercare
        ],
        inquiryemail: footerFields.inquiryemail,
        aboutinformation: footerFields.aboutinformation,
        contactforestimate: footerFields.contactforestimate,
        readmorelink: footerFields.readmorelink,
        copyrightby: footerFields.copyrightby
    }

    let { loading, data } = useQuery(GET_VIEWER)

    const [createLink,{ loading: submitLoading }] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            "input": inputData
        },
        fetchPolicy: 'no-cache'
    });

    // const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    //     variables: {
    //         "input": inputData
    //     },
    // });
    // const { loading, data, error } = useQuery(GET_VIEWER)
    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": inputData,
            "id": footerFields._id
        },

    });
    useEffect(() => {
        if (data) {
            setFooterFields(
                {
                    address: data.getFooter[0].address,
                    navigate: data.getFooter[0].navigate,
                    customercare: data.getFooter[0].customercare,
                    inquiryemail: data.getFooter[0].inquiryemail,
                    aboutinformation: data.getFooter[0].aboutinformation,
                    contactforestimate: data.getFooter[0].contactforestimate,
                    readmorelink: data.getFooter[0].readmorelink,
                    copyrightby: data.getFooter[0].copyrightby,
                    _id: data.getFooter[0]._id
                }
            )
        }

    }, [loading,submitLoading]);
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Footer Forms</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (footerFields && footerFields._id) {
                        updateLink();
                    } else {
                        createLink();
                    }
                }}>
                    <strong>Address Details</strong>
                    <div className="row mt-2">
                        <div className="form-group col-10">
                            <label>Address</label>
                            <textarea
                                name='address'
                                value={footerFields.address}
                                onChange={event => handlesingleInput(event, 'address')}
                                className="form-control" placeholder="Enter Addess" />
                        </div>
                    </div>
                    {/* <strong >Customercare</strong> */}
                    {footerFields.customercare.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label> Name</label> : null}
                                            <input type="text"
                                                name='pagename'
                                                value={input.pagename}
                                                onChange={event => handleInput(index, event, 'customercare')}
                                                className="form-control mr-3"
                                                placeholder="pagename" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label> Link</label> : null}
                                            <input type="url"
                                                name='pagelink'
                                                value={input.pagelink}
                                                onChange={event => handleInput(index, event, 'customercare')}
                                                className="form-control mr-3"
                                                placeholder="PageLink" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === footerFields.customercare.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("customercare")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <strong >Navigate</strong>
                    {footerFields.navigate.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label>NavPage Name</label> : null}
                                            <input type="text"
                                                name='name'
                                                value={input.name}
                                                onChange={event => handleInput(index, event, 'navigate')}
                                                className="form-control mr-3"
                                                placeholder="NavPageName" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col" >
                                            {index === 0 ? <label> Link</label> : null}
                                            <input type="url"
                                                name='link'
                                                value={input.link}
                                                onChange={event => handleInput(index, event, 'navigate')}
                                                className="form-control mr-3"
                                                placeholder="NavPageLink" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {index === footerFields.navigate.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("navigate")} className="form-control bg-success text-white">+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}

                    <label>Inquiry Email</label>
                    <input type="text"
                        name='inquiryemail'
                        value={footerFields.inquiryemail}
                        onChange={event => handlesingleInput(event, 'Estimatetext')}
                        className="form-control  mb-2"
                        placeholder="Email" />
                    <label>Free Estimate Text</label>
                    <input type="text"
                        name='aboutinformation'
                        value={footerFields.aboutinformation}
                        onChange={event => handlesingleInput(event, 'Estimatetext')}
                        className="form-control  mb-2"
                        placeholder="Estimate Text" />
                    <label>Free Estimate Number</label>
                    <input type="text"
                        name='contactforestimate'
                        value={footerFields.contactforestimate}
                        onChange={event => handlesingleInput(event, 'EstimateNumber')}
                        className="form-control mb-2"
                        placeholder="Enter Estimate Number" />
                    <label>ReadMore Link</label>
                    <input type="url"
                        name='readmorelink'
                        value={footerFields.readmorelink}
                        onChange={event => handlesingleInput(event, 'Readmorelink')}
                        className="form-control mb-2"
                        placeholder="ReadMoreLink" />
                    <label>Copy Right Text</label>
                    <input type="text"
                        name='copyrightby'
                        value={footerFields.copyrightby}
                        onChange={event => handlesingleInput(event, 'copytext')}
                        className="form-control mb-2"
                        placeholder="CopyRightText" />
                    <button type="submit" disabled={submitLoading} className="btn btn-primary">Submit</button>
                    {/* <button type="submit" className="btn btn-primary">Submit</button> */}
                </form>
            </div>
        </div>
    )
}
