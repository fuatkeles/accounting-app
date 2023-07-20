import React, { useState, useEffect } from 'react';
import { addDoc, getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PdfRead from './PdfRead';


import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate()
  const [income, setIncome] = useState(localStorage.getItem('income') || 0.00);
  const [latestInvoices, setLatestInvoices] = useState([]);
  const initialExpenses = 0.00;
  const [expenses, setExpenses] = useState(initialExpenses);
  const initialBalance = 0.00;
  const [balance, setBalance] = useState(initialBalance);
  const [paymentName, setPaymentName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [upcomingPayments, setUpcomingPayments] = useState([]);

  useEffect(() => {
    const fetchLatestInvoices = async () => {
      try {
        // Firestore'dan en son faturaları getir
        const q = query(collection(db, 'faturalar'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const invoices = querySnapshot.docs.map((doc) => doc.data());
          setLatestInvoices(invoices);

          // Giderleri topla
          const totalExpenses = invoices.reduce((total, invoice) => total + parseFloat(invoice.tutar), 0);
          setExpenses(totalExpenses);
        }
      } catch (error) {
        console.error('Veri çekilirken bir hata oluştu:', error);
      }
    };

    fetchLatestInvoices();
  }, []);

  useEffect(() => {
    // Gelir veya giderler değiştiğinde bakiyeyi güncelle
    const totalIncome = parseFloat(income);
    const totalBalance = totalIncome - expenses;
    setBalance(totalBalance);
  }, [income, expenses]);

  const handleIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setIncome(value);
    } else {
      setIncome(0.00);
    }
  };

  const handlePaymentNameChange = (e) => {
    setPaymentName(e.target.value);
  };

  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(e.target.value);
  };

  const handlePaymentDateChange = (e) => {
    setPaymentDate(e.target.value);
  };

  const handleAddPayment = async () => {
    const newPayment = {
      name: paymentName,
      amount: parseFloat(paymentAmount),
      date: paymentDate,
    };
  
    try {
      // Firestore'a verileri eklemek için bir obje oluştur
      const data = {
        name: paymentName,
        amount: parseFloat(paymentAmount),
        date: paymentDate,
      };
  
      // Firestore koleksiyonunu seç ve verileri ekleyin
      const collectionRef = collection(db, "yaklasan-odemeler");
      const docRef = await addDoc(collectionRef, data);
  
      console.log("Ödeme verisi Firestore'a eklendi.");
  
      // Eklenen ödemenin Firestore'daki belirli ID'sini alıp upcomingPayments dizisine ekleyelim
      setUpcomingPayments([...upcomingPayments, { ...newPayment, id: docRef.id }]);
  
      // Verileri sıfırla
      setPaymentName('');
      setPaymentAmount('');
      setPaymentDate('');
    } catch (error) {
      console.error("Firestore'a ödeme verisi eklenirken bir hata oluştu:", error);
    }
  };
  useEffect(() => {
    const fetchUpcomingPayments = async () => {
      try {
        // Firestore'dan yaklaşan ödemeleri getir
        const q = query(collection(db, 'yaklasan-odemeler'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const payments = querySnapshot.docs.map((doc) => doc.data());
          setUpcomingPayments(payments);
        }
      } catch (error) {
        console.error('Veri çekilirken bir hata oluştu:', error);
      }
    };
  
    fetchUpcomingPayments();
  }, []);
  

  const handleAddIncome = async () => {
    if (!isNaN(income)) {
      const newIncome = parseFloat(income) + parseFloat(income);
      const newBalance = parseFloat(balance) + newIncome;
  
      setIncome(newIncome);
      setBalance(newBalance);
      localStorage.setItem('income', newIncome.toString());
  
      try {
        // Firestore'a verileri eklemek için bir obje oluştur
        const data = {
          gelir: newIncome,
          gider: expenses,
          bakiye: newBalance,
        };
  
        // Firestore koleksiyonunu seç ve verileri ekleyin
        const collectionRef = collection(db, "gelir_gider_tablosu");
        await addDoc(collectionRef, data);
  
        console.log("Veriler Firestore'a eklendi.");
      } catch (error) {
        console.error("Firestore'a veri eklenirken bir hata oluştu:", error);
      }
    }
  };

  const censorTCKN = (tckn) => {
    // Eğer TCKN numarası 11 karakterden küçükse veya boşsa, olduğu gibi döndür
    if (tckn.length < 11 || !tckn) {
      return tckn;
    }
  
    // TCKN numarasının ilk 3 ve son 2 karakterini koruyarak ortadaki 7 karakteri sansürle
    const firstPart = tckn.slice(0, 3);
    const lastPart = tckn.slice(-2);
    const censoredPart = '*'.repeat(7);
  
    return firstPart + censoredPart + lastPart;
  };
  const handleLogout = () => {
    // Kullanıcıyı çıkış yaparak anasayfaya yönlendir
    // Burada kullanıcı oturumunu sonlandırma kodlarını ekleyebilirsiniz, ancak bu örnekte sadece anasayfaya yönlendiriyoruz.
    navigate('/login');
  };

  return (
    <Container>
      {/* Navbar */}
      <Navbar className='navbar-custom' expand="lg">
        <Container>
          <Navbar.Brand href="#">Accountancy App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link as={Link} to="/pdf-read">
                Load Invoice
              </Nav.Link>
            </Nav>
            {/* Logout Butonu */}
            <Button className='btn-logout' variant="outline-light" onClick={handleLogout}>
              Log Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Row className="mb-3 mt-3 justify-content-center">
        <Col md="6">
          <h2>Income</h2>
          <InputGroup className="mb-3">
            <FormControl
              type="number"
              value={income !== 0.00 ? income : ''}
              onChange={handleIncomeChange}
              placeholder="Enter an Income"
            />
            <Button variant="primary" onClick={handleAddIncome}>
              Add
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col md="7">
          {/* Son Eklenen Faturaları listele */}
          {latestInvoices.length > 0 && (
            <div>
              <h3>Last Invoices</h3>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>TCKN</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {latestInvoices.map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.name}</td>
                      <td>{censorTCKN(invoice.tckn)}</td>
                      <td>{invoice.date}</td>
                      <td>{invoice.tutar}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
        <Col md="5">
          {/* Gider ve Bakiye tablosunu göster */}
          <div>
            <h3>Income and Balance</h3>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Income</th>
                  <td>{income}</td>
                </tr>
                <tr>
                  <th>Expense</th>
                  <td>{expenses}</td>
                </tr>
                <tr>
                  <th>Balance</th>
                  <td>{balance}</td>
                </tr>
              </thead>
            </Table>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          {/* Yaklaşan Ödemeler Ekleme */}
          <div>
            <h3 className='mt-3'>Upcoming Payments</h3>
            <InputGroup className="mb-3 mt-3">
              <FormControl
                type="text"
                value={paymentName}
                onChange={handlePaymentNameChange}
                placeholder="Payment Place"
              />
              <FormControl
                type="number"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                placeholder="Total Payment"
              />
              <FormControl
                type="date"
                value={paymentDate}
                onChange={handlePaymentDateChange}
                placeholder="Date"
              />
              <Button variant="primary" onClick={handleAddPayment}>
                Add
              </Button>
            </InputGroup>
            {/* Ödemeler Tablosu */}
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Payment Place</th>
                  <th>Total Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {upcomingPayments.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.name}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
