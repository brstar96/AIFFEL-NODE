// socket.io 패키지 참조 
const SocketIO = require('socket.io');

// socket.js 모듈 기능 정의 
module.exports = (server, app)=>{
    // 소켓 접속 경로 설정 (클라이언트의 socket.io 접속 경로 지정) -> 생성자 패턴으로 instantiate
    // 클라이언트와 서버 소켓 간의 통신을 위한 'io' 객체 생성
    const io = SocketIO(server, {path: '/socket.io'});

    // on은 이벤트 발생 시 발동: 'connection' 이벤트 발생 시 콜백 함수 실행(socket 인자를 받아서 function 실행)
    // io 객체의 connection 이벤트 발생하면 클라이언트와 서버 소켓이 연결 완료된 상태. 
    // 모든 클라이언트와 서버 소켓간의 통신 처리는 connection 이벤트 안에서 구현
    io.on('connection', (socket)=>{

        // 첫 번째 기능: 'broadcast' 서버사이드 이벤트 수신기가 호출되었을 때 function 콜백 실행 
        // socket.on("서버이벤트수신기명", 클라이언트->서버 이벤트로 전달되는 파라미터 처리 콜백함수)
        socket.on("broadcast", function(msg){
            
            // io.emit("클라이언트 이벤트 수신기 이름 정의", 클라이언트 이벤트 수신기에 전달할 데이터)
            // io.emit() 메소드는 서버 소켓(socket.js)과 연결된 모든 클라이언트 소켓에게 메시지 전달
            // 100개의 브라우저(사용자)가 socket.js와 연결되어 있다면 100개의 브라우저에게 동일한 메시지 전달
            io.emit('receiveAll', msg); // 모든 클라이언트에게 메시지 전송
        }) 

        // test1 서버 이벤트 수신기 정의 
        socket.on('test1', async(data1, data2)=>{
            var msg = `${data1}:${data2}`
            console.log('클라이언트에서 보내준 메시지 출력: ', msg);
            io.emit('clientEvent1', msg);
        })

        // test2 정의 (수십개 파라미터를 주고받기 난감할때 JSON 사용)
        socket.on('test2', async(jsonData)=>{
            io.emit('clientEvent2', jsonData.nickName, jsonData.msg);
        })

        // 채팅방 입장 처리하기 
        socket.on('entry', async(channelId, nickName)=>{
            // 서버 소켓에서 채팅방을 'channelId'으로 생성 -> 방이 존재하면 그냥 사용, 없으면 connectionId를 roomId로 사용해 방 생성 
            // 현재 entry 수신기를 호출하는 클라이언트의 connectionId를 해당 채팅방의 사용자로 추가 
            socket.join(channelId)
            
            // 현재 서버 이벤트 수신기(entry)를 호출한 클라이언트에게만 메시지를 보내고 싶을때는 
            // socket.emit('클라이언트 이벤트 수신기명', 클라이언트에 보낼 메시지 데이터) 메소드 사용
            socket.emit('entryOk', `${nickName}님 환영합니다. (현재 채널: ${channelId})`); // 나한테만 전송
            
            // 지정한 채널(채팅방) 내 현재 접속자 제외 모든 채팅방 사용자에게 메시지 전송 (socket.to(roomId).emit())
            socket.to(channelId).emit('entryOk', `${nickName}님이 입장하셨습니다.`) // 나빼고 전부 전송 

        })

        // 그룹채팅 서버 이벤트 수신기 기능 정의 
        socket.on('send', async(data)=>{
            // 지정 채널에만 메시지 전송 (나를 포함한 모든 접속자) -> io.to(channelId).emit('클라이언트 이벤트 수신기명', 클라이언트에 보낼 메시지 데이터)
            io.to(data.channelId).emit('receiveGroupMsg', data)
        })
    })

}
