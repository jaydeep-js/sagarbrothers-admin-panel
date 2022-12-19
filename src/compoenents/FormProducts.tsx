import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';

const CREATE_LINK_MUTATION = gql`
mutation Mutation($input: ProductInput) {
    addProduct(input: $input) {
      _id
      Productpage {
        thumb_img
        skutext
        images
        desc
        categoryid {
          _id
        }
      }
    }
  }
`;


const GET_VIEWER = gql`query{
    getProduct {
        _id
        Productpage {
          thumb_img
          skutext
          images
          desc
          categoryid {
            _id
          }
        }
      }
  }`

const UPDATE_LINK_MUTATION = gql`
mutation Updateproduct($id: String!, $input: ProductInput) {
    updateproduct(_id: $id, input: $input) {
      _id
      Productpage {
        thumb_img
        skutext
        images
        desc
        categoryid {
          categoryname
          _id
        }
        _id
      }
    }
  }
`;


export const FormProducts: React.FC = () => {

    const initialstate = {
        _id: '',
        Productpage: [
            { images: '', thumb_img: '', skutext: '', desc: '' , categoryid:{_id:''}}
        ],
        // product: {
        //     title: '' ,
        //     Categoryname: { Categoryname: '' },
        //     "ProductsData": [{ skutext: '', Image: '', subimage: '' }],
        // }
    };

    const [productSection, setproductSection] = React.useState(initialstate);
    const handlesingleInput = (event, names) => {
        const datainput = { ...productSection };
        switch (names) {
            case 'producttitle':
                datainput.Productpage[event.target.name] = event.target.value;
                break;
            // case 'Categoryname':
            //     datainput.product.Categoryname[event.target.name] = event.target.value;
            //     break;
            default:
                break;
        }
        setproductSection(datainput);
    }
    const handleInput = (index: any, event, name) => {
        const data = { ...productSection };
        switch (name) {
            case 'product':
                data.Productpage[index][event.target.name] = event.target.value;
                break;
            case 'productimage':
                data.Productpage[index][event.target.name] = URL.createObjectURL(event.target.files[0]);
                break;
            case 'subimage':
                data.Productpage[index][event.target.name] = URL.createObjectURL(event.target.files[0]);
                break;
            default:
                break;
        }
        setproductSection(data);
    }
    const addFields = (fieldName) => {
        switch (fieldName) {

            case 'product':
                setproductSection(({ ...productSection, Productpage: [...productSection.Productpage, { images: '', thumb_img: '', skutext: '', desc: '', categoryid:{_id:''}}] }));
                 break;
            default:
                break;
        }
    }
    const { loading, data } = useQuery(GET_VIEWER)

    const inputData = {
        Productpage: [
            ...productSection.Productpage
        ]
    }

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            "input": inputData
        },
    });

    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": inputData,
            "id": productSection._id,
        },
    });


    useEffect(() => {
        if (data) {
            setTimeout(() =>
                setproductSection(
                    {
                        Productpage: [
                            ...data.getProduct[0].Productpage
                        ],
                        _id: data.getProduct[0]._id
                    }
                ), 1000);
        }
    }, [loading]);

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     console.log(productSection, 'Successful');
    // };

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Product Page</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (productSection && productSection._id) {
                        updateLink();
                    } else {
                        createLink();
                    }
                }}>
                    {/* <div className="row">
                        <div className="col-5">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text"
                                    name='title'
                                    value={productSection.product.title}
                                    onChange={event => handlesingleInput(event, 'producttitle')}
                                    className="form-control"
                                    placeholder="Title" required />
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input type="text"
                                    name='Categoryname'
                                    value={productSection.product.Categoryname.Categoryname}
                                    onChange={event => handlesingleInput(event, 'Categoryname')}
                                    className="form-control"
                                    placeholder="Categoryname" required />
                            </div>
                        </div>
                    </div> */}
                    <strong>All Product</strong>
                    {productSection.Productpage.map((input, index) => {
                        return (
                            <div className="row align-items-end mt-2" key={index}>
                                <div className="col">
                                <div className="form-group" >
                                    {index === 0 ? <label>SKu Text</label> : null}
                                        <input type="text"
                                            name='skutext'
                                            value={input.skutext}
                                            onChange={event => handleInput(index, event, 'product')}
                                            className="form-control"
                                            placeholder="Sku Text" required />
                                    </div>
                                    <div className="form-group" >
                                    {index === 0 ? <label>Category</label> : null}
                                        <input type="text"
                                            name='categoryid'
                                            value={input.categoryid._id}
                                            onChange={event => handleInput(index, event, 'product')}
                                            className="form-control"
                                            placeholder="categoryid" required />
                                    </div>
                                    <div className="form-group" >
                                    {index === 0 ? <label>Desc</label> : null}
                                        <input type="text"
                                            name='desc'
                                            value={input.desc}
                                            onChange={event => handleInput(index, event, 'product')}
                                            className="form-control"
                                            placeholder="desc" required />
                                    </div>
                                    <div className="form-group">
                                    {index === 0 ? <label>Image</label> : null}
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="images" onChange={event => handleInput(index, event, 'productimage')} required />
                                            <label className="custom-file-label form-control" >Choose file</label>

                                        </div>
                                    </div>
                                    {productSection.Productpage[index].images === '' ? null :
                                        <div className="form-group">
                                            <img src={productSection.Productpage[index].images} alt="img" width="150" height="150" className="shadow-sm bg-white rounded" />

                                        </div>
                                    }
                                    <div className="form-group">
                                    {index === 0 ? <label>Sub Image</label> : null}
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="thumb_img" onChange={event => handleInput(index, event, 'subimage')} required />
                                            <label className="custom-file-label form-control" >Choose file</label>
                                        </div>
                                    </div>
                                    {productSection.Productpage[index].thumb_img === '' ? null :
                                        <div className="form-group">
                                            <img src={productSection.Productpage[index].thumb_img} alt="subimage" width="150" height="150" className="shadow-sm bg-white rounded" />

                                        </div>
                                    }
                                </div>
                                <div className="col-2">
                                    {index === productSection.Productpage.length - 1 &&
                                        <div className="form-group">
                                            <button onClick={() => addFields("product")} className="form-control bg-success text-white">+</button>
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
