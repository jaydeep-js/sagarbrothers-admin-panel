import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from '@apollo/client';
const GET_VIEWER = gql`query{
    getCategory {
        _id
        categoryname
    }
  }`

const Category_LINK_MUTATION = gql`
mutation AddCategory($input: CategoryInput) {
    addCategory(input: $input) {
      categoryname
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
mutation Updatecategory($id: String!, $input: CategoryInput) {
  updatecategory(_id: $id, input: $input) {
    categoryname
    _id
  }
}
`;

export const FormCategory: React.FC = () => {

    const initialstate = {
        _id: '',
        categoryname: '',
    };
    const [categorySection, SetcategorySection] = React.useState(initialstate);
    const handlesingleInput = (event, names) => {
        const datainput = { ...categorySection };
        switch (names) {
            case 'Categoryname':
                datainput[event.target.name] = event.target.value;
                break;
            default:
                break;
        }
        SetcategorySection(datainput);
    }

    const [createLink] = useMutation(Category_LINK_MUTATION, {
        variables: {
            "input": {
                "categoryname": categorySection.categoryname
            }
        },
    });

    const { loading, data, error } = useQuery(GET_VIEWER);
    useEffect(() => {
        if (data) {
           
            SetcategorySection(
                {
                    _id: data.getCategory[0]._id,
                    categoryname: data.getCategory[0].categoryname,
                }
            )
        }

    }, [loading]);

    const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
        variables: {
            "input": {
                "categoryname": categorySection.categoryname
            },
            "id": categorySection._id,
        },
    });

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Category Page</h4>
                <form className="mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (categorySection && categorySection._id) {
                        updateLink();
                    } else {
                        createLink();
                    }
                }}>
                    <div className="row align-items-end"  >
                        <div className="col">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input type="text"
                                    name='categoryname'
                                    value={categorySection.categoryname}
                                    onChange={event => handlesingleInput(event, 'Categoryname')}
                                    className="form-control"
                                    placeholder="Categoryname" required />

                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
