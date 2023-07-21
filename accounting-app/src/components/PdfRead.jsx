import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase'; 
import { collection, addDoc,query, orderBy, getDocs  } from "firebase/firestore"; 
import { FaHome } from 'react-icons/fa';
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Navbar, Nav } from 'react-bootstrap'; 

import '../App.css';

const PdfRead = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [name, setName] = useState('');
  const [tckn, setTckn] = useState('');
  const [date, setDate] = useState('');
  const [tutar, setTutar] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [latestInvoices, setLatestInvoices] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const pdfUrl = URL.createObjectURL(file);
    setPdfUrl(pdfUrl);
    setShowInputs(true);
  };

  useEffect(() => {
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
      fileUpload.addEventListener('change', handleFileChange);
    }

    return () => {
      if (fileUpload) {
        fileUpload.removeEventListener('change', handleFileChange);
      }
    };
  }, []);

  useEffect(() => {
    const fetchLatestInvoices = async () => {
      try {
        // Firestore'dan en son faturaları getir
        const q = collection(db, 'faturalar');
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const invoices = querySnapshot.docs.map((doc) => doc.data());
          setLatestInvoices(invoices);
        }
      } catch (error) {
        console.error('Veri çekilirken bir hata oluştu:', error);
      }
    };

    fetchLatestInvoices();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTcknChange = (e) => {
    setTckn(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTutarChange = (e) => {
    setTutar(e.target.value);
  };

  const handleUpload = (e) => {
    e.preventDefault(); 

    const dataToSave = {
      name,
      tckn,
      date,
      tutar,
      pdfUrl,
    };

    // Firestore'a erişim 
    addDoc(collection(db, "faturalar"), dataToSave)
      .then((docRef) => {
        console.log('Veriler başarıyla eklendi. Doküman ID:', docRef.id);
        setName('');
        setTckn('');
        setDate('');
        setTutar('');
        setPdfUrl('');
        setShowInputs(false);
      })
      .catch((error) => {
        console.error('Veri eklenirken bir hata oluştu:', error);
      });
  };

  const redirectToHome = () => {
    navigate('/');
  };

  return (
    <>
     
      <Container>
      <Navbar  className="navbar-custom" expand="lg" >
        <Container>
          <Navbar.Brand as={Link} to="/">Accountancy Appı</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/pdf-read">Load Invoice</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="center-horizontally">
        <h1 className="heading mt-3">Load Invoice</h1>
        
      </div>
      <form onSubmit={handleUpload}>
        <div className="file-input-container">
          <input
            type="file"
            id="file-upload"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>
        {pdfUrl && (
          <div className="main-content">
            <div className="pdf-viewer">
              <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
                <p>Promoter is required to view the PDF.</p>
              </object>
            </div>
            {showInputs && (
              <div className="info-container">
                <h2 className="heading">Invoice Details</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                  className="text-input"
                />
                <input
                  type="text"
                  placeholder="TCKN"
                  value={tckn}
                  onChange={handleTcknChange}
                  className="text-input"
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={handleDateChange}
                  className="text-input"
                />
                <input
                  type="text"
                  placeholder="Total"
                  value={tutar}
                  onChange={handleTutarChange}
                  className="text-input"
                />
                <button type="submit" className="submit-button">Submit</button>
              </div>
            )}
          </div>
        )}
      </form>
      </Container>
    </>
  );
};

export default PdfRead;
