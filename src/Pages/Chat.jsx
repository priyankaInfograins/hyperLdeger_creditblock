
import React, { useState, useEffect } from 'react'
import UserHeader from './UserHeader'
import { Container, Row, Col, Form, Button, InputGroup, ListGroup, Offcanvas, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { FiSmile } from 'react-icons/fi';
import $ from 'jquery';
import axios from 'axios';


function Chat() {

  const [showChatBar, setShowChatBar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sideUser_loader, setSideUser_loader] = useState(false)
  const [search, setSearch] = useState("")
  const [searchData, setSearchData] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [show, setShow] = useState(false);
  const [selectedUserChat, setSelectedUserChat] = useState("");
  const [chats, setChats] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const [chatUserName, setChatUserName] = useState("Username")
  const [userError, setUserError] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [ChatSection_Loader, setChatSection_Loader] = useState(false)
  const [userErrorMsg, setUserErrorMsg] = useState(false)
  const loggedInUser = JSON.parse(sessionStorage.getItem("userInfo"));
  const [UserImage, setChatUserImage] = useState("")



  if (sessionStorage.length < 1 || sessionStorage.getItem("userInfo") === null) {
    window.location.pathname = "/crediblockhyperledger/login"
  }

  if (!sessionStorage.getItem("userInfo")) {
  } else {
    let sessionKey = JSON.parse(sessionStorage.getItem("userInfo"));
    if (sessionKey.statusCode === 200) {
    } else {

      window.location.pathname = "/crediblockhyperledger/login"
    }
  }

  let History = useNavigate()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    if (!loggedInUser || loggedInUser === null) {
      History("/login")
    }

    if (loggedInUser.role === 3) {
      $("#chat_bar").hide()
      $("#searchUser").hide();
    }


  }, [])


  $(".validate").focus(function () {
    $("#userError").hide();

  })


  // =========function for serach all user=======
  const handleSearch = async () => {

    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };
      const { data } = await axios.get(`http://148.72.244.170:3000/userslist?search=${search}`, config);
      setLoading(false)
      console.log("get searched users data", data)


      if (data.statusCode === 400) {
        setUserError(data.statusMsj);
        setUserErrorMsg(true)
        setLoading(false)
        setSearchData([]);
      }
      if (data.statusCode === 200) {
        setUserErrorMsg(false)
        setLoading(false)
        setSearchData(data.users);
      }
    } catch (error) {
      console.log("Search errror", error)
      setLoading(false)
    }
  };

  const onKeyUp = (event) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      handleSearch();
    }
  }


  // =========function for create chat of all user=========
  const createChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      await axios.post("http://148.72.244.170:3000/chat/createChat", { userId }, config).then(res => {
        if (res.data.statusCode === 200 && res.data.statusMsg === 'Chat already Created') {
          console.log("'Chat already Created'", res.data.Chat)
        }
        setChatUserName()

      }).catch(err => {
        console.log("err", err)
      })
    }

    catch (error) {
      console.log("error", error)
    }
    setShow(false)
  }

  // ==========function for fetch all user=======
  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      setSideUser_loader(true)
      await axios.get("http://148.72.244.170:3000/chat/fetchchat", config)
        .then(res => {
          console.log("fetch users for chat:18 june", res.data)
          setLoading(false)
          setSideUser_loader(false)
          if (res.data.statusCode === 400) {
            History('/chat');
            setSideUser_loader(false)
          } else {
            setSideUser_loader(false)
            setChats(res.data.chat);
          }

        })
        .catch(error => {
          setSideUser_loader(false)
          setLoading(false)
          console.log("error", error)
        })
    }
    catch (error) {
      setSideUser_loader(false)
      setLoading(false)
      console.log("fecth api", error)
    }

  }

  useEffect(() => {
    fetchUsers();
  }, [show])


  //=============function for fetch  all users chat messages============
  const fetchMessage = async (chatId, username, image) => {
    console.log("Chat Id selected user ----", chatId, username)
    setSelectedUserChat(chatId);
    setChatUserName(username)
    setChatUserImage(image)
    console.log("imageeeeeeeee", image)

    try {
      setShowChatBar(true)
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };


      setLoading(true)
      setChatSection_Loader(true)

      // setInterval(async () => {
        console.log("Chat Id selected user ----Chat Id selected user", selectedUserChat)
        await axios.post(`http://148.72.244.170:3000/message/allMessages`, { chatId }, config).then(async xyz => {
          setUserChat(xyz.data.message)
          var fetchChatdata = await axios.get("http://148.72.244.170:3000/chat/fetchchat", config)
          console.log("fetchChatdata", fetchChatdata)
          setChats(fetchChatdata.data.chat);

          setChatSection_Loader(false)
          setLoading(false)
        }).catch(err => {
          setLoading(false)
          setChatSection_Loader(false)
          console.log("chat msg err", err)
        })
      // }, 2000);

    }
    catch (error) {
      setChatSection_Loader(false)
      setLoading(false)
      console.log("error while fetching user chat ", error)
    }


  }




  //=============function for  send messages============

  const sendMessage = async () => {
    setChatSection_Loader(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      const data = await axios.post("http://148.72.244.170:3000/message/sendMessage", {
        content: newMessage,
        chatId: selectedUserChat
      }, config)
      setUserChat(data.data.message)
      
      setChatSection_Loader(false)
    }
    catch (error) {
      console.log("errror", error)
      setChatSection_Loader(true)
    }
    setNewMessage("")
    setShowPicker(false);


  }
  const enterText = (event) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      sendMessage()
      setShowPicker(false);
    }
  }

  //=============function for emoji icons============
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);

  };



  return (
    <div>
      <UserHeader />
      <div className="chat_box">
        <Container fluid>
          <Row>
            <Col lg={3} md={3} className="left_chat_box px-0">
              <div className="search_text">
                <p className='text-center' id="searchUser" onClick={handleShow}>Search New Users Here <BsArrowLeft /></p>

                <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#f2f2f2", borderRight: "none" }}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title></Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Row>
                      <Col lg={12} md={12}>
                        <h6 className='title_head'>Search users for create chat</h6>
                      </Col>
                      <Col lg={12} md={12}>
                        <InputGroup className="p-3 searchDiv">
                          <Form.Control type="text" placeholder="Search..." className='search_bar validate' value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={onKeyUp} />
                          <Button variant="primary" size="md" active onClick={handleSearch}>
                            <FaSearch />
                          </Button>
                        </InputGroup><br></br>
                        <h5 className='error text-center userListError' style={userErrorMsg ? { display: "block" } : { display: "none" }}>User not found</h5>
                      </Col>


                      <Col lg={12} md={12}>
                        {/* ========search data function========= */}
                        {loading ?
                          <div className='loader' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            <FaSpinner icon="spinner" className="spinner" />
                          </div>

                          :

                          <div className="user_list p-2 ">
                            {searchData && searchData.map((e, i) => {
                              return (
                                <ListGroup variant="" key={i}>
                                  <ListGroup.Item >
                                    <div className="users" onClick={() => createChat(e._id)}>
                                      <div className="user_img">
                                        <img src={e.pic} alt="" width="45px" /><span>{e.first_name} {e.last_name}</span>
                                      </div>

                                    </div>
                                  </ListGroup.Item>
                                </ListGroup>
                              )
                            })}
                          </div>
                        }
                      </Col>
                    </Row>

                  </Offcanvas.Body>
                </Offcanvas>
              </div>


              {/* ========selected user data function========= */}


              {
                loading ? <div className='loader'>
                  <FaSpinner icon="spinner" className="spinner" />
                </div> :
                  <div className="user_list px-2">
                    <div className='loader' style={sideUser_loader ? { display: "flex" } : { display: "none" }}>
                      <FaSpinner icon="spinner" className="spinner" />
                    </div>
                    {chats ?
                      <div>

                        {
                          chats.map((chatData, index) => {
                            return (
                              <div>
                                <ListGroup variant="" onClick={() => fetchMessage(chatData._id, chatData.reciver_name, chatData.image)} key={index}>
                                  <div className='active_user_icon' style={{ display: "none" }}></div>
                                  <div className="user_img">
                                    {/* <Avatar name={e.first_name+" "+e.last_name} maxInitials={2}/> */}
                                    <div className='searched_user'>
                                      <div className='user_img_name'>
                                        <img src={chatData.image} alt="" width="45px" />
                                        <div>
                                          <div className='name_font' style={{ fontWeight: "600" }}>{chatData.reciver_name}</div>
                                          <div>{chatData.latestMessage}</div>
                                        </div>
                                      </div>
                                      <div className='readStatus '>{chatData.unread_messages}</div>
                                    </div>

                                  </div>
                                </ListGroup>
                              </div>
                            )
                          })
                        }
                      </div>
                      :
                      <div className='row'>
                        <div className='col-md-12'>
                          <h4 className='no-user'>Start Chat on Secure Chat</h4>
                        </div>
                      </div>
                    }

                  </div>
              }
            </Col>

            <Col lg={9} md={9} className="right_chat_box px-0">
              {/* ========show chat data function========= */}
              <div>
                {
                  selectedUserChat ?
                    <div className="chat_user_name">
                      <div className="active_user_img p-2">
                        <div className="user_img">
                          <img src={UserImage} alt="" width="45px" />
                        </div>
                      </div>
                      <div className="active_user">
                        <p className='chatwith'>Chat with</p>
                        <p className='username'>{chatUserName}</p>
                      </div>
                    </div>
                    :
                    <div className="chat_user_name" style={{ display: "none" }}></div>
                }


                <div className="chat_room">
                  <div className='loader' style={ChatSection_Loader ? { display: 'flex', justifyContent: "center", alignItems: "center" } : { display: 'none', justifyContent: "center", alignItems: "center" }}>
                    <FaSpinner icon="spinner" className="spinner" />
                  </div>
                  {selectedUserChat ?
                    <div className="chatMsg">
                      {userChat ?
                        userChat.map((e) => {

                          if (loggedInUser._id === e.sender_id) {
                            return (
                              <div className="message">
                                <div className="odd-blurb">
                                  <p>{e.content}</p>
                                </div>
                              </div>
                            )
                          } if (loggedInUser.role === 3 && e.sender_id === e.users[1]) {
                            return (
                              <div className="message">
                                <div className="odd-blurb">
                                  <p>{e.content}</p>
                                </div>
                              </div>
                            )
                          }
                          else {
                            return (
                              <div className="message">
                                <div className="blurb">
                                  <p>{e.content}</p>
                                </div>
                              </div>
                            )
                          }
                        })
                        : <div style={{ display: "none" }}>loading</div>}
                    </div>
                    :
                    (loggedInUser.role === 3) ?
                      (<div className='row'>
                        <div className='col-lg-12'>
                          <div className='chatting_title'> Click on a user to view chatting</div>
                        </div>
                      </div>)
                      :
                      (<div className='row'>
                        <div className='col-lg-12'>
                          <div className='chatting_title'> Click on a user to start chatting</div>
                        </div>
                      </div>)
                  }

                </div>



                {
                  (() => {
                    if ((loggedInUser.role === 3)) {
                      return null
                    } else {
                      return (
                        showChatBar ?
                          <div className="chat-bar" id="chat_bar">
                            <Row>
                              <Col lg={12} md={12} sm={12} xs={12} >
                                <div className="msg_ins d-flex">
                                  <Form.Control className='' type="text" placeholder="Write new message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={enterText}  />
                                  <div className="send_msg d-flex">
                                    <Button onClick={sendMessage}><span><FaPaperPlane /></span></Button>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          :
                          " "
                      )
                    }
                  })()
                }

              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* <UserFooter /> */}
    </div>
  )
}

export default Chat