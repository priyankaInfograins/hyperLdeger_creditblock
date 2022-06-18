import React, { useState,useEffect } from 'react'
import UserHeader from './UserHeader'
import { BsArrowLeft } from 'react-icons/bs';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { FaUserEdit } from 'react-icons/fa'
import { BsCameraFill } from 'react-icons/bs'
import axios from 'axios';

function UserProfile() {
    const navigate = useNavigate();
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [isEdit, setIsEdit] = useState(false)
    const [MyProfile, setProfile] = useState();
    const [image, setImage] = useState("");
    const [imageprev, setImageprev] = useState("");
    
    const loggedInUser = JSON.parse(sessionStorage.getItem("userInfo"));

    async function handleChange(e) {
        var formData = new FormData();
        console.log("lllllllllllllllllll")
        const config = {
            headers: {
              Authorization: `Bearer ${loggedInUser.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          };
        setImageprev(URL.createObjectURL(e.target.files[0]));

        formData.append("image",e.target.files[0]);
        console.log("image",e.target.files[0])

        var a = formData.getAll("image")
        console.log("aaaaaaaa",a)
       
        var data = await axios.post("http://148.72.244.170:3000/uploadImage",formData ,config)
        console.log("datadatadatadatadata",data)
    }

   
    const edit_Profile = () => {
        setIsEdit(true)
        setFirstName(MyProfile.first_name)
        setLastName(MyProfile.last_name)
    }
    const update_Profile = async () => {

        const config = {
            headers: {
              Authorization: `Bearer ${loggedInUser.accessToken}`,
            },
          };
        var userProfile  = await axios.post(`http://148.72.244.170:3000/updateUser?_id=${loggedInUser._id}`,{
            first_name:firstname,last_name:lastname}, config
        ) 
        console.log("userProfile",userProfile)
        setIsEdit(false)
        window.location.reload()
        // setImage(e.target.files[0])

        // formData.append("image",image);
        // console.log("image",image)
       
        // var data = await axios.post("http://148.72.244.170:3000/uploadImage",formData ,config)
        // console.log("datadatadatadatadata",data)
    }
    const getProfile = async () =>{
        var result = await axios.post("http://148.72.244.170:3000/getUser", {"id" : loggedInUser._id
        })
        
        if(result.data.data.role === 1){
            result.data.data.role = "Client";
        }
        if(result.data.data.role === 2){
            result.data.data.role = "Broker";
        }
        if(result.data.data.role === 3){
            result.data.data.role = "Supervisor";
        }
        console.log("myProfileeeeeeeee",result.data.data)
        setProfile(result.data.data)
        setImageprev(result.data.data.pic)
       
    }
    useEffect(() => {
        getProfile();
    },[])
   
    
    return (
        <>
            <UserHeader />

            <div className="profile">
                <Container>
                    <Row>
                        <Col lg={{ span: 6 , offset: 3 }} md={{ span: 8, offset: 2 }}>
                            {isEdit ?
                                <div className="edit_profile">
                                    <h5 className='text-center'>Edit Profile</h5>
                                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                        <Form.Label column sm="4">
                                            <div className="edit_profile_img">
                                                <img src={imageprev} alt="profile_pic" className='img-fluid' />
                                                <div className="wrapper">
                                                    <div className="file-upload">
                                                    <input type="file" id='profile_image' name='profile_image'
                                                    onChange={handleChange}
                                                    //  onChange={(e)=>{
                                                    //     setImage(e.target.files[0])
                                                    //     setImageprev(URL.createObjectURL(e.target.files[0]));

                                                    //     }}
                                                     />
                                                   
                                                        <BsCameraFill />
                                                    </div>
                                                </div>
                                            </div>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control 
                                                    type="text" 
                                                    // placeholder={loggedInUser.first_name} 
                                                    className='mt-4'
                                                    value = {firstname}
                                                    onChange={(e)=>setFirstName(e.target.value)}
                                                    name="first_name"
                                                    required
                                                     />

                                            <Form.Control 
                                                    type="text" 
                                                    // placeholder={loggedInUser.last_name}
                                                    className='mt-3'
                                                    value = {lastname}
                                                    onChange = {(e)=>setLastName(e.target.value)}
                                                    name="last_name"
                                                    required
                                                     />

                                            <div className="update_btn">
                                                <Button variant="success" className='mt-3' onClick={update_Profile}>Update Profile</Button>
                                            </div>
                                        </Col>
                                    </Form.Group>

                                </div>
                                :
                                <div className="user_profile">
                                    <div className="icons">
                                        <div className="back_arrow">
                                            <Link to="/chat"><BsArrowLeft /></Link>
                                        </div>
                                        <div className="profile_title d-none">
                                            <h5>My Profile</h5>
                                        </div>
                                        <div className="edit">

                                            {['top'].map((placement) => (
                                                <OverlayTrigger
                                                    key={placement}
                                                    placement={placement}
                                                    overlay={
                                                        <Tooltip id={`tooltip-${placement}`}>
                                                            Edit Profile
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button onClick={edit_Profile}><FaUserEdit /></Button>
                                                </OverlayTrigger>
                                            ))}
                                        </div>
                                    </div>
                                   
                                    <div className="profile_img">
                                    {MyProfile ?<img src={MyProfile.pic} alt="profile_pic" className='img-fluid' />
                                    :
                                    <img src="" alt="profile_pic" className='img-fluid' />
                                    }
                                        
                                    </div>
                                    <div className="profile_content">
                                        { MyProfile? 
                                            <div>
                                            <table className="table table-borderless">
                                            <tbody>
                                            <tr>
                                            <th>Name</th>
                                            <td>{MyProfile.first_name + " "+ MyProfile.last_name}</td>
                                            </tr>
                                            <tr>
                                            <th>Email</th>
                                              
                                               <td>{MyProfile.email}</td>
                                            </tr>
                                            <tr>
                                            <th>Role</th>
                                            <td>{
                                                MyProfile.role}</td>
                                            </tr>
                                            <tr>
                                            <th>Organization</th>
                                            <td>{MyProfile.orgName}</td>
                                            </tr>
                                            </tbody>
                                            </table>
                                               
                                                
                                                
                                               
                                              
                                            </div>
                                            :<div>
                                            <p>waiting.............</p>
                                            </div>
                        
                                        }

                                        
                                    </div>
                                </div>

                            }
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}

export default UserProfile