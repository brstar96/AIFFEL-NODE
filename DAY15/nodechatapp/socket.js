// socker.io 패키지 참조 
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
            // io.emit() 메소드는 서버 소켓(socker.js)과 연결된 모든 클라이언트 소켓에게 메시지 전달
            // 100개의 브라우저(사용자)가 socket.js와 연결되어 있다면 100개의 브라우저에게 동일한 메시지 전달
            io.emit('receiveAll', msg); // 모든 클라이언트에게 메시지 전송
        }) 

        // test1 서버 이벤트 수신기 정의 
        socket.on('test1', async(data1, data2)=>{
            io.emit('clientEvent1', data1, data2);
        })

        // test2 정의 (수십개 파라미터를 주고받기 난감할때 JSON 사용)
        socket.on('test2', async(jsonData)=>{
            io.emit('clientEvent2', jsonData.nickName, jsonData.msg);
        })
    })

}
