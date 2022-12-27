import React, { useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";

const GET_VIEWER = gql`
  query {
    getCategories {
      _id
      category {
        _id
        name
      }
    }
  }
`;

const Category_LINK_MUTATION = gql`
  mutation AddCategory($input: CategoryInput) {
    addCategory(input: $input) {
      _id
      category {
        _id
        name
      }
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
  mutation updateCategory($_id: String!, $input: CategoryInput) {
    updateCategory(_id: $_id, input: $input) {
      _id
      category {
        _id
        name
      }
    }
  }
`;

export const FormCategory: React.FC = () => {
  const [categorySection, SetCategorySection] = React.useState({
    _id: "",
    category: [
      {
        name: "",
      },
    ],
  });
  const [isNewItem, setIsNewItem] = React.useState(true);

  const addFields = (fieldName) => {
    switch (fieldName) {
      case "category":
        SetCategorySection({
          ...categorySection,
          category: [...categorySection.category, { name: "" }],
        });
        break;
      default:
        break;
    }
  };
  const handleSingleInput = (index: any, event, names) => {
    const category = [...categorySection.category];
    const categoryData = { ...category[index] };

    switch (names) {
      case "name":
        categoryData[event.target.name] = event.target.value;
        break;
      default:
        break;
    }
    category[index] = categoryData;
    SetCategorySection({ ...categorySection, category });
  };

  const [createLink] = useMutation(Category_LINK_MUTATION, {
    variables: {
      input: {
        category: categorySection.category,
      },
    },
  });

  const {
    loading,
    data = [],
    refetch,
  } = useQuery(GET_VIEWER, {
    variables: {
      input: {
        skip: 0,
        limit: 10,
      },
    },
  });

  useEffect(() => {
    if (categorySection && categorySection._id) {
      setIsNewItem(false);
    }
    if (data && data.getCategories) {
      SetCategorySection({ ...data.getCategories });
    }
    console.log({ categorySection });
  }, [loading, categorySection._id]);

  const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
    variables: {
      input: {
        category: categorySection.category,
      },
      _id: categorySection._id,
    },
  });

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Category Page</h4>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isNewItem) {
              createLink().then(({ data }) => {
                if (data && data.addCategory) {
                  SetCategorySection({
                    ...categorySection,
                    _id: data.addCategory._id,
                  });
                }
              });
            } else {
              updateLink();
            }
          }}
        >
          <div className="row align-items-end">
            <div className="col">
              {categorySection.category.map((cat, index) => {
                return (
                  <div className="form-group" key={index}>
                    <label>Category Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cat.name}
                      onChange={(event) =>
                        handleSingleInput(index, event, "name")
                      }
                      className="form-control"
                      placeholder="categoryName"
                      required
                    />

                    <div className="col-2">
                      {index === categorySection.category.length - 1 && (
                        <div className="form-group">
                          <button
                            onClick={() => addFields("category")}
                            className="form-control bg-success text-white"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
