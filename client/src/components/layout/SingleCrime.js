import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "./Navbar";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import "./ClientsSlider.css";
import "../../pages/App.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "./ClientsSlider.css";

import { getSimilarCategories, getCrimeByID } from "../../redux/actions/crimes";

const SingleCrime = ({ crime, getSimilarCategories, getCrimeByID, crimes }) => {
  const navigate = useNavigate();
  const [loadingModal, setLoadingModal] = React.useState(false);
  useEffect(() => {
    getSimilarCategories(crime.category._id);
    console.log(crimes);

    console.log(
      crimes.crimes.filter((similarCrime) => similarCrime._id !== crime._id)
        .length
    );
  }, [getSimilarCategories]);
  return (
    <>
      <NavigationBar />
      <main id="main" className="container">
        <section id="breadcrumbs" className="breadcrumbs">
          <div className="container">
            <ol>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/crimes">Crimes</NavLink>
              </li>
            </ol>
            <h2>{crime.title}</h2>
          </div>
        </section>

        <section id="blog" className="blog">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-12 entries">
                <article className="entry entry-single">
                  <div className="entry-img">
                    <img src={crime.photo} alt="" className="img-fluid" />
                  </div>

                  <h2 className="entry-title">{crime.title}</h2>

                  <div className="entry-meta">
                    <ul>
                      <li className="d-flex align-items-center">
                        <Moment format="YYYY/MM/DD">{crime.commitedAt}</Moment>
                      </li>
                      <li className="d-flex align-items-center">
                        {crime.location}
                      </li>
                      <li className="d-flex align-items-center">
                        {crime.category.category} Category
                      </li>
                    </ul>
                  </div>

                  <div className="entry-content">
                    <p>{crime.description}</p>
                  </div>

                  <h4 style={{ marginTop: "4rem" }}>Suspicious Criminals</h4>
                  <div className="criminals d-flex">
                    {crime.criminals.map((criminal) => {
                      return (
                        <div
                          className="criminal mr-4"
                          style={{ width: "90px" }}
                        >
                          <div className="criminal-image w-100">
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "100%",
                              }}
                              src={
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuZ9k0a58JfVhJt69eL2ajiaasscYV6L5P2Yu9OMo_YrG3J-OIPw1H4TI6lXRP-6U6vLA&usqp=CAU"
                              }
                            />
                          </div>
                          <div className="criminal-name text-center">
                            {" "}
                            {criminal.firstName} {criminal.lastName}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* <div className="entry-footer">
                    <i className="bi bi-folder"></i>
                    <ul className="cats">
                      <li>
                        <a href="#">Business</a>
                      </li>
                    </ul>

                    <i className="bi bi-tags"></i>
                  <ul className="tags">
                    <li>
                      <a href="#">Creative</a>
                    </li>
                    <li>
                      <a href="#">Tips</a>
                    </li>
                    <li>
                      <a href="#">Marketing</a>
                    </li>
                  </ul>
                  </div> */}
                </article>
              </div>
            </div>
          </div>
        </section>
        {loadingModal && (
          <Modal
            show={loadingModal}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className="text-center">
              <h3
                id="contained-modal-title-vcenter"
                className="text-center  my-4"
              >
                Loading
              </h3>
              <div className="spinner-border text-center" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {crimes.loading ? (
          <h1>Loading</h1>
        ) : crimes.crimes.length &&
          crimes.crimes.filter((similarCrime) => similarCrime._id !== crime._id)
            .length > 0 &&
          !crimes.loading ? (
          <div className="similar-crimes my-4">
            <h4>Similar Posts</h4>
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={100}
              slidesPerView={4}
              pagination={{ clickable: true }}
            >
              {crimes.crimes
                .filter((similarCrime) => similarCrime._id !== crime._id)
                .map((crime) => {
                  return (
                    <SwiperSlide
                      className="justify-content-center"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setLoadingModal(true);
                        getCrimeByID(crime._id).then(() => {
                          setLoadingModal(false);

                          return navigate(`/crimes/crime/${crime._id}`);
                        });
                      }}
                    >
                      {" "}
                      <img
                        src={crime.photo}
                        className="img-fluid h-100 w-100 mx-auto"
                        alt="fbi"
                        style={{ objectFit: "cover" }}
                      />
                      <p className="lean text-center text-danger text-underline">
                        {crime.title.length > 20
                          ? crime.title.substring(0, 50) + "..."
                          : crime.title}
                      </p>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
};
const mapStateToProps = (state) => ({
  crimes: state.crimes,
});
export default connect(mapStateToProps, { getSimilarCategories, getCrimeByID })(
  SingleCrime
);
