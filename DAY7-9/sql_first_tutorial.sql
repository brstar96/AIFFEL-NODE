# SQL은 RDBMS server의 각종 DB객체(생성, 관리)와 데이터를 제어하는 프로그래밍 언어
# 회원정보 테이블의 모든 데이터와 column 조회

SELECT * FROM member;

# 회원정보 테이블 신규 회원 정보를 등록합니다
# INSERT INTO 테이블명(컬럼1, 컬럼2, ...) Values('컬럼 1값, 컬럼 2값,...)
INSERT INTO member(email, member_name, telephone, entry_date) Values ('test1@test.co.kr', '이명규1', 010-1234-5678, now());
INSERT INTO member(email, member_name, entry_date) Values ('test2@test.co.kr', '이명규2', now());

# 아래 두 구문 동시 실행하면 자동으로 인덱스 번호가 붙음을 알 수 있음. ('AI' 옵션 체크했기 때문)
INSERT INTO member(email, member_name, telephone, entry_date) Values ('test3@test.co.kr', '이명규3', 010-1234-5678, now());
INSERT INTO member(email, member_name, telephone, entry_date) Values ('test4@test.co.kr', '이명규4', 010-1234-5678, now());

# 회원명 column은 반드시 값이 들어와야 하는 not NULL column -> 값을 넣지 않으면 에러 발생, row 등록이 안됨.
INSERT INTO member(email, member_name, telephone, entry_date) Values ('test4@test.co.kr', 010-1234-5678, now());

/*
DB에 들어갈 수 있는 데이터 유형
실제 데이터, null, ''(빈 문자열)
*/

## UPDATE 구문을 활용해 회원정보 테이블의 특정 column 값을 수정해 보자 
# UPDATE member SET column_name1=변경할 값, column_name2=변경할 값, ... WHERE 조건절;

# CASE 1) 회원명을 모두 이명규로 바꿔 보기: 테이블의 조건을 걸지 않으면 모든 해당 데이터가 변경됨. 
UPDATE member SET member_name = '이명규';

# CASE2) 조건을 걸어서 데이터를 변경해 보기 
UPDATE member SET member_name = '이명규' WHERE member_id = 1;
UPDATE member SET telephone = '010-2760-2222' WHERE member_id = 2;

# CASE3) 여러 내용을 조건과 함께 바꿔보기 
UPDATE member SET member_name = '이명규', member_name='이명규99' WHERE member_id = 3;

# CASE4) 회원정보 영구 삭제해 보기 (반드시 조건 넣어서 시행)
DELETE FROM memer;

# CASE5) 조건 걸어서 삭제해 보기 
DELETE FROM member WHERE member_id >= 7;

## 다양한 조건의 Query문 작성해보기 
SELECT * FROM member WHERE member_id = 5 OR telephone is null;
SELECT * FROM member WHERE (member_name = '이명규1' AND telephone = '010-1234-5678') OR member_id = 10;

# 이름이 '이'로 시작하는 사람 모두 조회: `LIKE`라는 Patten matching 구문 사용 
# %명%: '명'이 포함된 모든 값, 이%: '이'로 시작하는 모든 값, %규: '규'로 끝나는 모든 값
SELECT * FROM member WHERE member_name LIKE '이' AND telephone='010-1234-5678';
SELECT * FROM member WHERE member_name LIKE '%명%';

# 데이터 조회 결과물을 정렬해 보기 
# 오름차순: ASC(ascending, 작은 순서) / 내림차순: DESC(descending, 큰 순서)
SELECT * FROM member ORDER BY member_id ASC;
SELECT * FROM member ORDER BY member_id DESC;

# BE의 핵심이 되는 데이터에 대한 등록(Create), 조회(Read), 업데이트(Update), 삭제(Delete)를 'CRUD'라고 부름. 
/*
- Create: INSERT INTO 테이블명 () VALUES();
- Read: SELECT * FROM 테이블명;
- Update: UPDATE 테이블명 SET 컬럼명='';
- Delete: DELETE FROM 테이블명 WHERE 조건...
*/


