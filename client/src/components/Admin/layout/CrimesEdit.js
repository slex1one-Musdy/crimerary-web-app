import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { editCrime, getCrimeByID } from "../../../redux/actions/crimes";
import { connect } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getCriminals } from "../../../redux/actions/criminals";
import { getCategories } from "../../../redux/actions/category";

const CrimesForm = ({
  getCriminals,
  getCrimeByID,
  editCrime,
  categories,
  getCategories,
  crime,
  criminals: { criminals, loading },
}) => {
  const crimeID = window.location.pathname.split("/dashboard/edit-crime/")[1];

  //Make animated things when removing select option data
  const animatedComponents = makeAnimated();

  const initialState = {
    title: "",
    description: "",
    location: "",
    commitedAt: "",
    criminals: [],
    photo: "",
    category: [],
  };
  const navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const [image, setImage] = useState({ photo: "" });
  // const [datas, setDatas] = useState({
  //   title: "Galatya",
  //   description: "Galatya",
  //   location: "Galatya",
  //   commitedAt: "",
  //   criminals: [],
  //   photo: "",
  //   category: "Murder",
  // });

  const [datas, setDatas] = useState({
    title: "",
    description: "",
    location: "",
    commitedAt: "",
    criminals: [],
    photo: "",
    category: "",
  });

  const [selectedCriminals, setSelectedCriminals] = useState([]);
  const [selectedCatg, setSelectedCatg] = useState({});

  useEffect(() => {
    getCriminals();
    getCategories();

    if (!crime && crimeID) {
      getCrimeByID(crimeID);
    }

    if (
      crime &&
      !crime.loading &&
      categories &&
      !categories.loading &&
      criminals &&
      !criminals.loading
    ) {
      const crimePostData = { ...initialState };
      for (const key in crime) {
        if (key in crimePostData) crimePostData[key] = crime[key];
      }

      const selectedCategory = categories.filter(
        (category) => category._id === crime.category._id
      )[0];

      // setSelectedCatg({
      //   value: selectedCategory._id,
      //   label: selectedCategory.category,
      // });
      //HATA VERIR BUL NEDENINI

      setDatas({ ...datas, ...crimePostData });

      setImage({ ...image, photo: crimePostData.photo });

      setSelectedCriminals([
        ...crimePostData.criminals.map((criminal) => {
          return {
            value: criminal._id,
            label: `${criminal.firstName} ${criminal.lastName}`,
          };
        }),
      ]);
    }
  }, [
    loading,
    getCriminals,
    getCategories,
    getCrimeByID,
    crime && crime.loading,
    criminals && criminals.loading,
    categories && categories.loading,
  ]);

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

  const { title, description, location, commitedAt, category } = datas;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    datas.photo = image.photo;
    datas.criminals = [...selectedCriminals];
    datas.category = { ...selectedCatg };
    formData.append("photo", datas.photo);
    formData.append("title", title);
    formData.append("description", description.trim());
    formData.append("location", location.trim());
    formData.append("commitedAt", commitedAt);
    formData.append("category", datas.category.value);
    formData.append("criminals", JSON.stringify(datas.criminals));

    setDisable(true);

    editCrime(crimeID, formData).then(() => {
      setDisable(false);
      navigate("/dashboard/crimes");
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
  };

  return crime && crime.loading ? (
    <h3>Loading</h3>
  ) : (
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
              value={selectedCriminals}
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
              value={selectedCatg}
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
              Save
            </button>
          </Col>
          {disable && (
            <Col className="align-self-center">
              <div className="spinner-border text-success " role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};

CrimesForm.propTypes = {
  criminals: PropTypes.object,
  getCrimeByID: PropTypes.func.isRequired,
  editCrime: PropTypes.func.isRequired,
  crime: PropTypes.object,
};

const mapStateToProps = (state) => ({
  criminals: state.criminals,
  crime: state.crimes.crime,
  categories: state.category.categories,
});
export default connect(mapStateToProps, {
  getCriminals,
  getCrimeByID,
  getCategories,
  editCrime,
})(CrimesForm);
