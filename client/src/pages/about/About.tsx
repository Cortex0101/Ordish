import React from "react";
import { Container } from "react-bootstrap";

import "./About.scss"

function About() {
  return (
    <Container className="main-content">
      <h1 className="mb-4">About Ordish</h1>
      <p>
        Ordish is a modern web application designed to help you manage your tasks and projects efficiently. Built with React, Node.js, and MongoDB, it provides a user-friendly interface and powerful features to enhance your productivity.
      </p>
    </Container>
  );
}

export default About;