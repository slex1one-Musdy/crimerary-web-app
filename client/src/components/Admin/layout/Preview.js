import React from "react";

import { Modal, Button } from "react-bootstrap";
import Moment from "react-moment";

const Preview = (props) => {
  return (
    <Modal
      {...props}
      key={props.crime._id}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Preview Crime Post Thumbnail
        </Modal.Title>
      </Modal.Header>
      {props.crime && props.crime.loading ? (
        <h1>Loading</h1>
      ) : (
        <Modal.Body>
          <article className="entry">
            <div className="entry-img">
              <img
                src={`${props.crime.photo}`}
                alt={`${props.crime.title}`}
                className="img-fluid"
              />
            </div>

            <h2 className="entry-title">
              <p>{props.crime.title}</p>
            </h2>

            <div className="entry-meta">
              <ul>
                <li className="d-flex align-items-center">
                  <i className="fas fa-users text-danger align-self-center"></i>{" "}
                  {props.crime.criminals.length} criminal(s)
                </li>
                <li className="d-flex align-items-center">
                  <Moment format="YYYY/MM/DD">{props.crime.commitedAt}</Moment>
                </li>
                <li className="d-flex align-items-center">
                  {props.crime.location}
                </li>
                <li className="d-flex align-items-center">
                  {props.crime.category.category}
                </li>
              </ul>
            </div>

            <div className="entry-content">
              <p>
                {" "}
                {props.crime.description.length > 20
                  ? props.crime.description.substring(0, 120) + "..."
                  : props.crime.description}
              </p>
            </div>
          </article>
          <Button className="btn btn-block btn-dark" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Body>
      )}
    </Modal>
  );
};

Preview.propTypes = {};

export default Preview;
