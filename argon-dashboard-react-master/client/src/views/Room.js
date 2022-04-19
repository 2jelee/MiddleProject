// import { useEffect, useState, useRef } from "react";
// import Peer from 'simple-peer';
// import styled from 'styled-components';
// // node.js library that concatenates classes (strings)
// import classnames from "classnames";
// import Video from "./examples/Video";
// import socket from "client_socket";


// // reactstrap components
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   Container,
//   Row,
//   Col,
//   CardTitle,
// } from "reactstrap";



// import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
// import Header from "components/Headers/Header.js";



// const Room = (props) => {
//   const currentUser = sessionStorage.getItem('user');

//   const [peers, setPeers] = useState([]);
//   const [userVideoAudio, setUserVideoAudio] = useState({
//     localUser: { video: true, audio: true },
//   });
//   const [videoDevices, setVideoDevices] = useState([]);
//   const peersRef = useRef([]);
//   const userVideoRef = useRef();
//   const userStream = useRef();
//   const roomId = props.match.params.roomId;

//   function createPeer(userId, caller, stream) {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream,
//     });

//     peer.on('signal', (signal) => {
//       socket.emit('BE-call-user', {
//         userToCall: userId,
//         from: caller,
//         signal,
//       });
//     });
//     peer.on('disconnect', () => {
//       peer.destroy();
//     });

//     return peer;
//   }

//   function addPeer(incomingSignal, callerId, stream) {
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream,
//     });

//     peer.on('signal', (signal) => {
//       socket.emit('BE-accept-call', { signal, to: callerId });
//     });

//     peer.on('disconnect', () => {
//       peer.destroy();
//     });

//     peer.signal(incomingSignal);

//     return peer;
//   }

//   function findPeer(id) {
//     return peersRef.current.find((p) => p.peerID === id);
//   }
//   function createUserVideo(peer, index, arr) {
//     return (
//       <VideoBox
//         className={`width-peer${peers.length > 8 ? '' : peers.length}`}
//         // onClick={expandScreen}
//         key={index}
//       >
//         {writeUserName(peer.userName)}

//         <Video key={index} peer={peer} number={arr.length} />
//       </VideoBox>
//     );
//   }

//   function writeUserName(userName, index) {
//     if (userVideoAudio.hasOwnProperty(userName)) {
//       if (!userVideoAudio[userName].video) {
//         return <div key={userName}>{userName}</div>;
//       }
//     }
//   }

//   /* const [participant, setParticipant] = useState(['참여자1', '참여자2', '참여자3', '참여자4'])
//   const [message, setMessage] = useState('');
//   let [cam, changeCam] = useState(true);
//   let [mic, changeMic] = useState(true);

//   function chatting() {
//     let newMessage = [...message];
//     message.unshift(message);
//     setMessage(newMessage);
//   } */

//   useEffect(() => {
//     navigator.mediaDevices.enumerateDevices().then((devices) => {
//       const filtered = devices.filter((device) => device.kind === 'videoinput');
//       setVideoDevices(filtered);
//     });

//     // Connect Camera & Mic
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         userVideoRef.current.srcObject = stream;
//         userStream.current = stream;

//         socket.emit('BE-join-room', { roomId, userName: currentUser });
//         socket.on('FE-user-join', (users) => {
//           // all users
//           const peers = [];
//           users.forEach(({ userId, info }) => {
//             let { userName, video, audio } = info;

//             if (userName !== currentUser) {
//               const peer = createPeer(userId, socket.id, stream);

//               peer.userName = userName;
//               peer.peerID = userId;

//               peersRef.current.push({
//                 peerID: userId,
//                 peer,
//                 userName,
//               });
//               peers.push(peer);

//               setUserVideoAudio((preList) => {
//                 return {
//                   ...preList,
//                   [peer.userName]: { video, audio },
//                 };
//               });
//             }
//           });

//           setPeers(peers);
//         });

//         socket.on('FE-receive-call', ({ signal, from, info }) => {
//           let { userName, video, audio } = info;
//           const peerIdx = findPeer(from);

//           if (!peerIdx) {
//             const peer = addPeer(signal, from, stream);

//             peer.userName = userName;

//             peersRef.current.push({
//               peerID: from,
//               peer,
//               userName: userName,
//             });
//             setPeers((users) => {
//               return [...users, peer];
//             });
//             setUserVideoAudio((preList) => {
//               return {
//                 ...preList,
//                 [peer.userName]: { video, audio },
//               };
//             });
//           }
//         });

//         socket.on('FE-call-accepted', ({ signal, answerId }) => {
//           const peerIdx = findPeer(answerId);
//           peerIdx.peer.signal(signal);
//         });

//         socket.on('FE-user-leave', ({ userId, userName }) => {
//           const peerIdx = findPeer(userId);
//           peerIdx.peer.destroy();
//           setPeers((users) => {
//             users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
//             return [...users];
//           });
//           peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId);
//         });
//       });
//   })

//   return (
//     <>
//       <Header />
//       <Container className="mt--7" fluid>
//         {/* <Row>
//           {
//             participant.map(function (data, i) {
//               return (
//                 <>
//                   <Col lg="6" xl="3">
//                     <Card className="card-stats mb-4 mb-xl-0">
//                       <CardBody>
//                         <Row>
//                           <div className="col">
//                             <CardTitle tag="h5" className="text-uppercase text-muted mb-0">{data}</CardTitle>
//                           </div>
//                           <Col className="col-auto">
//                           </Col>
//                         </Row>
//                         <p className="mt-3 mb-0 text-muted text-sm">
//                         </p>
//                       </CardBody>
//                     </Card> <br />
//                   </Col>
//                 </>
//               )
//             })
//           }
//         </Row> */}
//         <Row className="mt-5">
//           <Col className="mb-5 mb-xl-0" xl="8">
//             <Card className="shadow">
//               <CardHeader className="border-0" style={{ height: '350px' }}>
//               </CardHeader>
//               <div>
//                 <div className="col text-right">
//                   {/* <Col className="col-auto">
//                     <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={() => { changeCam(!cam) }}>
//                       {cam === true ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
//                     </div>&nbsp;
//                     <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={() => { changeMic(!mic) }}>
//                       {mic === true ? <BsFillMicFill /> : <BsFillMicMuteFill />}
//                     </div>
//                   </Col> */}
//                 </div>
//                 <VideoBox className={`width-peer${peers.length > 8 ? '' : peers.length}`}>
//                   {userVideoAudio['localUser'].video ? null : (
//                     <div>{currentUser}</div>
//                   )}
//                   <MyVideo
//                     ref={userVideoRef}
//                     muted
//                     autoPlay
//                     playsInline
//                   ></MyVideo>
//                 </VideoBox>
//                 {peers &&
//                   peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
//               </div>
//             </Card>
//             <br />
//             <div>
//               <Button className="mr-4" color="default" size="sm">카메라 선택</Button>
//               <Button className="mr-4" color="default" size="sm">마이크 선택</Button>
//             </div>
//           </Col>
//           <Col className="mb-5 mb-xl-0" xl="4">
//             {/* <Card className="shadow">
//               <CardHeader className="border-0" style={{ height: '218px' }}>
//                 <Row className="align-items-center">
//                   <div className="col">받은 메세지</div>
//                 </Row>
//                 <Row className="align-items-center">
//                   <div className="col text-right">보낸 메세지 {message} </div>
//                 </Row>
//               </CardHeader>
//               <CardHeader className="border-0">
//                 <Row className="align-items-center">
//                   <div className="col text-right">
//                     <hr />
//                     <input onChange={(e) => { setMessage(e.target.value) }} style={{ width: '80%', border: 'none' }} />
//                     <Button color="primary" onClick={chatting} size="sm">SEND</Button>
//                   </div>
//                 </Row>
//               </CardHeader>
//             </Card> */}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// const MyVideo = styled.video``;

// const VideoBox = styled.div`
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   > video {
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//   }

//   :hover {
//     > i {
//       display: block;
//     }
//   }
// `;

// export default Room;
