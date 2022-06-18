import React from 'react'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/images/logo.png'
function Header() {
    if(!sessionStorage.getItem("userInfo")){
        // console.log("if");
    } else{
        console.log("else");
        let sessionKey = JSON.parse(sessionStorage.getItem("userInfo"));
        console.log("sessionKey", sessionKey.statusCode);
        if(sessionKey.statusCode === 200){
            window.location.pathname = "/crediblockhyperledger/chat"
        } else{
        }
    }
    return (
        <>
            {/* <Container fluid>
                <Row>
                    <Col lg={12} md={12} className="px-0">
                        <div className="header mt-4">
                            <div className='siteLogo'>
                                <img src={Logo} alt="logo" />
                                <p>Secure<b>Chat</b></p>
                            </div>
                        </div>

                    </Col>
                </Row>
            </Container> */}
            <Navbar className='mainNav' expand="lg">
                <Container fluid>
                    <NavLink to="/" className='siteLogo navbar-brand site_logo'>
                        <img src={Logo} alt="site_logo" /><b>Secure</b>Chat</NavLink>
                </Container>
            </Navbar>
        </>
    )
}

export default Header
