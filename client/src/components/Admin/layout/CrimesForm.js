import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { createCrime } from "../../../redux/actions/crimes";
import { connect } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getCriminals } from "../../../redux/actions/criminals";
import { getCategories } from "../../../redux/actions/category";
import Swal from "sweetalert2";

const CrimesForm = ({
  createCrime,
  getCriminals,
  getCategories,
  categories,
  criminals: { criminals, loading },
}) => {
  useEffect(() => {
    getCriminals();
    getCategories();
  }, [getCriminals, getCategories]);

  //Make animated things when removing select option data
  const animatedComponents = makeAnimated();

  const navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const [image, setImage] = useState({ photo: "" });
  const [datas, setDatas] = useState({
    title: "",
    description: "",
    location: "",
    commitedAt: "",
    criminals: [],
    photo: "",
    //category: "Murder",
  });

  const [selectedCriminals, setSelectedCriminals] = useState([]);
  const [selectedCatg, setSelectedCatg] = useState({});

  const handleChange = (e) => {
    setDatas({
      ...datas,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage({
      ...image,
      photo: file,
    });
  };

  const handleCriminalsChange = (criminal) => {
    return setSelectedCriminals([...criminal]);
  };

  const handleCategoryChange = (catg) => {
    return setSelectedCatg({ ...catg });
  };

  const { title, description, location, commitedAt } = datas;

  const handleSubmit = (e) => {
    e.preventDefault();

    datas.criminals = [...selectedCriminals];
    datas.photo = image.photo;
    datas.category = { ...selectedCatg };

    const formData = new FormData();

    formData.append("photo", datas.photo);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("location", location.trim());
    formData.append("commitedAt", commitedAt);
    formData.append("category", datas.category.value);
    formData.append("criminals", JSON.stringify(datas.criminals));
    setDisable(true);

    createCrime(formData).then(() => {
      setDisable(false);
      // navigate("/dashboard/crimes");
    });

    //Empty inputs after submit

    setDatas({
      title: "",
      description: "",
      location: "",
      commitedAt: "",
      criminals: "",
      category: "",
    });

    // navigate("/dashboard/crimes");
  };

  return (
    <div>
      <Link to="/dashboard/crimes" className="mb-3 nav-link pl-0">
        <i className="fas fa-long-arrow-alt-left"></i> Back
      </Link>
      <h1 className="lead mb-4" style={{ fontSize: "2rem" }}>
        Crimes Form
      </h1>
      <Form onSubmit={handleSubmit}>
        <Row xs={1} md={3}>
          <Col className="my-2">
            <Form.Label>
              Enter Title of Crime{" "}
              <span className=" text-danger">(*Required)</span>
              <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                Title has to be unique title among the posts.
              </p>
            </Form.Label>
            <Form.Control
              placeholder="Title"
              name="title"
              disabled={disable}
              value={title}
              onChange={(e) => handleChange(e)}
            />
          </Col>
          <Col className="my-2">
            <Form.Label>
              Enter Location of Crime{" "}
              <span className=" text-danger">(*Required)</span>
              <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                Enter the location of crime where commited at.
              </p>
            </Form.Label>
            <Form.Control
              placeholder="Location"
              name="location"
              disabled={disable}
              value={location}
              onChange={(e) => handleChange(e)}
            />
          </Col>
          <Col className="my-2">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                Upload Image of Crime{" "}
                <span className=" text-danger">(*Required)</span>
                <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                  Upload the thumbnail image for crime post.
                </p>
              </Form.Label>
              <Form.Control
                type="file"
                name="photo"
                disabled={disable}
                onChange={(e) => handleImageChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="my-4" xs={1} md={3}>
          <Col className="my-2">
            <Form.Label>
              Choose Criminals <span className=" text-danger">(*Required)</span>
              <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                Please choose the criminals from downside (dropdown menu).
              </p>
            </Form.Label>

            <Select
              isDisabled={loading}
              placeholder="Choose criminal(s)"
              isSearchable
              isDisabled={disable}
              value={criminals.label}
              options={
                criminals &&
                criminals.map((criminal) => {
                  return {
                    value: criminal._id,
                    label: `${criminal.firstName} ${criminal.lastName}`,
                  };
                })
              }
              components={animatedComponents}
              isMulti
              onChange={(criminal) => handleCriminalsChange(criminal)}
            />
          </Col>
          <Col className="my-2">
            <Form.Group controlId="dob">
              <Form.Label>
                Choose Crime Commited Date{" "}
                <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                  If you dont know the date leave it as empty. (Today's date
                  picked by default.)
                </p>
              </Form.Label>

              <Form.Control
                type="date"
                name="dob"
                disabled={disable}
                placeholder="Date of Birth"
                name="commitedAt"
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
          </Col>

          <Col className="my-2">
            <Form.Label>
              Select Crime Category{" "}
              <span className=" text-danger">(*Required)</span>
              <p className="text-black-50 mb-0" style={{ fontSize: "12px" }}>
                Please choose the category from downside (dropdown menu).
              </p>
            </Form.Label>
            <Select
              isDisabled={loading}
              placeholder="Choose Category"
              isSearchable
              isDisabled={disable}
              value={categories.label}
              options={
                categories &&
                categories.map((catg) => {
                  return {
                    value: catg._id,
                    label: catg.category,
                  };
                })
              }
              components={animatedComponents}
              onChange={(categry) => handleCategoryChange(categry)}
            />
          </Col>
        </Row>

        <Row xs={1} md={1} className="my-4">
          <Col className="my-2">
            <Form.Label>
              Brief Description of Crime{" "}
              <span className=" text-danger">(*Required)</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Leave description here"
              style={{ height: "100px" }}
              name="description"
              disabled={disable}
              value={description}
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row xs={1} md={4}>
          <Col className="my-2">
            <button
              disabled={disable}
              className="btn btn-success  w-100 text-center"
            >
              Save{" "}
              {disable && (
                <span
                  className="spinner-border spinner-border-sm text-light "
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </span>
              )}
            </button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

CrimesForm.propTypes = {
  createCrime: PropTypes.func.isRequired,
  criminals: PropTypes.object,
};

const mapStateToProps = (state) => ({
  criminals: state.criminals,
  categories: state.category.categories,
});
export default connect(mapStateToProps, {
  createCrime,
  getCriminals,
  getCategories,
})(CrimesForm);
