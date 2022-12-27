import React, { Fragment, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import Select from "react-select";

const CREATE_LINK_MUTATION = gql`
  mutation Mutation($input: ProductInput) {
    addProduct(input: $input) {
      _id
      productPage {
        _id
        image
        thumbImg
        skuText
        categoryId
        desc
      }
    }
  }
`;

const GET_CATEGORY_VIEWER = gql`
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

const GET_VIEWER = gql`
  query {
    getProducts {
      _id
      productPage {
        _id
        image
        thumbImg
        skuText
        categoryId
        desc
      }
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
  mutation updateProduct($_id: String!, $input: ProductInput) {
    updateProduct(_id: $_id, input: $input) {
      _id
      productPage {
        _id
        desc
        categoryId
        image
        skuText
        thumbImg
      }
    }
  }
`;

export const FormProducts: React.FC = () => {
  const [productSection, setProductSection] = React.useState({
    _id: "",
    productPage: [
      {
        categoryId: [],
        desc: "",
        image: "",
        skuText: "",
        thumbImg: "",
      },
    ],
  });
  const [selectedOption, setSelectedOption] = React.useState([[]]);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [isNewItem, setIsNewItem] = React.useState(true);
  const [errors, setErrors] = React.useState({
    image: [],
    thumbImg: [],
  });
  const validateInput = () => {
    const err = {
      image: [],
      thumbImg: [],
    };
    if (productSection.productPage.length) {
      productSection.productPage.map(({ image = "", thumbImg = "" }) => {
        let imgErr = "";
        let thumbErr = "";
        if (!image.length) {
          imgErr = "Image is required";
        }
        if (!thumbImg.length) {
          thumbErr = "Thumb Image is required";
        }
        err.image.push(imgErr);
        err.thumbImg.push(thumbErr);
      });
      setErrors({ ...err });
    }

    return err.image.length || err.thumbImg.length;
  };

  const handleInput = (index: any, event, name) => {
    const products = [...productSection.productPage];
    const productData = { ...products[index] };

    switch (name) {
      case "categoryId":
        const values = event.map(({ value }) => value);

        const selectedCat = [...values];
        productData[name] = selectedCat;
        selectedOption[index] = [...selectedCat];

        console.log("event", event);
        console.log("selectedOption", selectedOption);

        setSelectedOption([...selectedOption]);
        break;
      case "desc":
        productData[event.target.name] = event.target.value;
        break;
      case "image":
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const arrayBuffer = reader.result;
          productData[event.target.name] = arrayBuffer;
          products[index] = productData;
          setProductSection({ ...productSection, productPage: products });
        };
        break;
      case "skuText":
        productData[event.target.name] = event.target.value;
        break;
      case "thumbImg":
        const readerThumb = new FileReader();
        readerThumb.readAsDataURL(event.target.files[0]);
        readerThumb.onloadend = () => {
          const arrayBuffer = readerThumb.result;
          productData[event.target.name] = arrayBuffer;
          products[index] = productData;
          setProductSection({ ...productSection, productPage: products });
        };
        break;
      default:
        break;
    }
    products[index] = productData;
    setProductSection({ ...productSection, productPage: products });
  };

  const addFields = (fieldName) => {
    switch (fieldName) {
      case "product":
        setProductSection({
          ...productSection,
          productPage: [
            ...productSection.productPage,
            {
              image: "",
              thumbImg: "",
              skuText: "",
              desc: "",
              categoryId: [],
            },
          ],
        });
        break;
      default:
        break;
    }
  };

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      input: {
        ...productSection,
        _id: undefined,
      },
    },
  });

  const [updateLink] = useMutation(UPDATE_LINK_MUTATION, {
    variables: {
      input: { ...productSection, _id: undefined },
      _id: productSection._id,
    },
  });
  const { loading, data } = useQuery(GET_VIEWER);
  const { loading: categoryOptionLoad, data: category } =
    useQuery(GET_CATEGORY_VIEWER);

  useEffect(() => {
    if (category && category.getCategories) {
      const op = category.getCategories.category.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOptions(op);
    }
  }, [categoryOptionLoad]);

  useEffect(() => {
    if (data && data.getProducts) {
      setProductSection({ ...data.getProducts });
    }
    if (category && data && data.getProducts && categoryOptions.length) {
      const selectedOp = data.getProducts.productPage.map((p, i) => {
        if (!p.categoryId) {
          p.categoryId = [];
        }
        return p.categoryId.map((selCat) => {
          const categoryLabel = categoryOptions.find(
            (category) => category.value == selCat
          );
          return { value: selCat, label: categoryLabel.label };
        });
      });
      setSelectedOption([...selectedOp]);
    }
    if (productSection && productSection._id) {
      setIsNewItem(false);
    }
  }, [loading, productSection._id, categoryOptionLoad]);

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Product Page</h4>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (validateInput()) {
              if (isNewItem) {
                createLink().then(({ data }) => {
                  if (data && data.addProduct) {
                    setProductSection({
                      ...productSection,
                      _id: data.addProduct._id,
                    });
                  }
                });
              } else {
                updateLink();
              }
            }
          }}
        >
          <strong>All Product</strong>
          {productSection.productPage.map((input, index) => {
            return (
              <div className="row align-items-end mt-2" key={index}>
                <div className="col">
                  <div className="form-group">
                    {index === 0 ? <label>SKu Text</label> : null}
                    <input
                      type="text"
                      name="skuText"
                      value={input.skuText}
                      onChange={(event) => handleInput(index, event, "skuText")}
                      className="form-control"
                      placeholder="Sku Text"
                      required
                    />
                  </div>
                  <div className="form-group">
                    {index === 0 ? <label>Category</label> : null}
                    <Select
                      name="categoryId"
                      onChange={(event) =>
                        handleInput(index, event, "categoryId")
                      }
                      className="form-control"
                      placeholder="categoryId"
                      value={categoryOptions.filter((c) =>
                        input.categoryId.includes(c.value)
                      )}
                      options={categoryOptions}
                      required
                      isMulti
                    />
                  </div>
                  <div className="form-group">
                    {index === 0 ? <label>Desc</label> : null}
                    <input
                      type="text"
                      name="desc"
                      value={input.desc}
                      onChange={(event) => handleInput(index, event, "desc")}
                      className="form-control"
                      placeholder="desc"
                      required
                    />
                  </div>
                  <div className="form-group">
                    {index === 0 ? <label>Image</label> : null}
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        name="image"
                        onChange={(event) => handleInput(index, event, "image")}
                      />
                      <label className="custom-file-label form-control">
                        Choose file
                      </label>
                    </div>
                  </div>
                  {errors.image[index]
                    ? errors.image[index].length > 0 && (
                        <span className="error">{errors.image[index]}</span>
                      )
                    : ""}
                  {productSection.productPage[index].image === "" ? null : (
                    <div className="form-group">
                      <img
                        src={productSection.productPage[index].image}
                        alt="img"
                        width="150"
                        height="150"
                        className="shadow-sm bg-white rounded"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    {index === 0 ? <label>Sub Image</label> : null}
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        name="thumbImg"
                        onChange={(event) =>
                          handleInput(index, event, "thumbImg")
                        }
                      />
                      <label className="custom-file-label form-control">
                        Choose file
                      </label>
                    </div>
                  </div>
                  {errors.thumbImg[index]
                    ? errors.thumbImg[index].length > 0 && (
                        <span className="error">{errors.thumbImg[index]}</span>
                      )
                    : ""}
                  {productSection.productPage[index].thumbImg === "" ? null : (
                    <div className="form-group">
                      <img
                        src={productSection.productPage[index].thumbImg}
                        alt="subimage"
                        width="150"
                        height="150"
                        className="shadow-sm bg-white rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="col-2">
                  {index === productSection.productPage.length - 1 && (
                    <div className="form-group">
                      <button
                        onClick={() => addFields("product")}
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
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
