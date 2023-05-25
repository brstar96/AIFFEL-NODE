//socket.io 팩키지 참조
const SocketIO = require("socket.io");

//socket.js모듈 기능정의(익명함수)
module.exports =(server)=>{
    // 서버에서 input/output 통신을 담당하는 핵심 IO 객체 
    const io = SocketIO(server,{path:"/socket.io"});

    // 반드시 server socket은 클라이언트와 연결이 완료된 상태에서 메시지를 주고받음. 
    // "connection" 이벤트가 발생(on)했을때 (socket) 안에서 ping-pong
    io.on("connection",(socket)=>{ // Ping 
        // broadcast: 서버사이드 수신기 (클라이언트에서 broadcast 이벤트의 msg 메시지를 클라이언트에서 전송해줌)
        socket.on("broadcast",function(msg){ // Pong
            
            // io.emit: 현재 서버 소켓에 연결된 모든 클라이언트에서 메시지를 보내되, 
            // 클라이언트 라이브러리의 receiveAll이라는 이벤트 수신기가 msg라는 데이터를 수신. 
            io.emit("receiveAll",msg); 

            //socket.broadcast.emit("receive",msg);
        });
    });
}