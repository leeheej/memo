async function editMemo(event) {
  //console.log(event.target);
  //console.log(event.target.dataset.id); //id를 알아내는 방법
  const id = event.target.dataset.id;
  const editInput = prompt("수정할 값을 입력하세요");
  //console.log(editInput); 수정될 값이 서버에 보내기지 전에 제대로 입력 받는지 확인
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", //값을 수정할때 주로 사용
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id, // id=id 일땐 생략해도 들어감
      content: editInput,
    }),
  }); // 패스로 특정 id값을 보내는데 쿼리는 정렬이나 필터링에 사용되니 리퀘스트 바디를 사용해서 보내도록!
  readMemo(); //요청 보낸 다음 제대로 업데이트 되는지 보기 위해서
}

async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    //ulr에 delete를 붙일 수도 있지만 그러면 직관적이지 않고 추가되는 작업이 많아짐
    method: "DELETE", //요청보내는게 없으므로 Headers와 body 없어도 됨
  });
  readMemo();
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo_ul");
  const li = document.createElement("li");
  const editBtn = document.createElement("button");
  li.innerText = `[id:${memo.id}] ${memo.content}`;
  editBtn.innerText = "edit";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id; // 자바스크립트에서 data-id 값을 각 메모에 넣어줌

  const delBtn = document.createElement("button");
  delBtn.innerText = "X";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id; //delBtn은 버튼 태그로 생성 후 클릭했을때 deleteMemo 함수가 실행되게하며, id값을 부여함

  ul.appendChild(li);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
}

async function readMemo() {
  const res = await fetch("/memos"); // read 는 Get 요청이므로 디폴트값
  const jsonRes = await res.json();
  //console.log(jsonRes);
  // jsonRes에는 값이 있는 배열
  const ul = document.querySelector("#memo_ul");
  ul.innerHTML = "";
  //ul의 내용을 초기화

  jsonRes.forEach(displayMemo);
  //["a","b","c"].forEach(func) 이면 a에 대해서 함수 실행, B에 대해서 함수 실행 ... 해당 배열에선 c까지 총 3번 함수가 실행됨
}

async function creatMemo(value) {
  //console.log("value", value);
  //서버한테 요청 보내기
  //const res = await fetch("/memos") 그냥 이렇게 보내면 디폴트 값인 get요청 (값을 달라는 의미)로 보내짐.
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      content: value,
    }),
  });
  //const jsonRes = await res.json();
  //console.log(jsonRes);
  readMemo();
}

function handleSubmit(e) {
  e.preventDefault();
  //console.log("제출 이벤트 동작 확인");
  const input = document.querySelector("#memo_input");
  //console.log(inpout.value)
  creatMemo(input.value);
  input.value = "";
}

const form = document.querySelector("#memo_form");
form.addEventListener("submit", handleSubmit);

readMemo(); // 맨 처음에 서버의 데이터값 불러오기 위해 실행! 그리고 creat 하고 실행
