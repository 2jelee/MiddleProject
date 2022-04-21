import React, { useRef, useState, useEffect } from "react";
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
// node.js library that concatenates classes (strings)

import socket from "../client_socket";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Input,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "reactstrap";

import Header from "components/Headers/Header.js";




const Index = (props) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [roomInput, setRoomInput] = useState("");
  const [roomNames, setRoomNames] = useState([]);

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  console.log(roomRef);
  console.log(userRef);


  //roomInput 변경
  const onCreateRoom = (event) => {
    event.preventDefault();
    setRoomInput(event.target.value);
  }

  //변경된 roomInput을 배열에 저장
  const onRoomList = (event) => {
    //새로고침 방지
    event.preventDefault();
    setRoomNames((currentArray) => [...currentArray, roomInput]);//배열에 roomName 추가
    setRoomInput(" "); //input창 초기화
  }


  let roomName;
  let nickName;


  useEffect(() => {
    console.log(userRef.current.value);
    socket.on('FE-error-user-exist', ({ roomId, userName, error }) => {

      if (!error) { //에러가 없으면
        sessionStorage.setItem('user', userName);
        props.history.push(`/room/${roomId}`); // roomName으로 push
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history]);


  function clickJoin(item) {
    roomRef.current.value = item;
    roomName = roomRef.current.value;
    const userName = userRef.current.value;
    console.log(userName);

    if (!roomName || !userName) {
      setErr(true);
      setErrMsg('Enter Room Name or User Name');
    } else {
      socket.emit('BE-check-user', { roomId: roomName, userName });
    }
  };


  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" >
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center" >
                    <Col className="col-sm-5">
                      <h3 className="mb-0">방 목록</h3>
                    </Col>
                    <Col className="" >
                      {/* roomName Input */}
                      <Form id="form1" onSubmit={onRoomList} >
                        <Input className="text-right" value={roomInput} type="text" required id="1"
                          ref={roomRef} placeholder="방 이름을 입력한 후에 Enter!" onChange={onCreateRoom} />
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    {/* nickName Input */}
                    <Input className="text-right" type="text" required id="2"
                      ref={userRef} placeholder="닉네임을 입력한 후에 Enter!" />
                  </Row>
                </CardHeader>
                <Table hover className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th >방 이름</th>
                      <th scope="col"> </th>
                      <th scope="col">참여인원</th>
                      <th scope="col"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomNames.map((item, index) => ( //map함수 이용, 저장된 roomName으로 테이블 row 생성
                      <tr key={index}>
                        <th >{item}</th>
                        <td> </td>
                        <td> </td>
                        <td><Button onClick={() => clickJoin(item)} color="primary" size="sm">참여</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div> 
    </>
  );
};

export default Index;
