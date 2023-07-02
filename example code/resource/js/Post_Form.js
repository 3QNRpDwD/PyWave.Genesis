function addCommentsToContainer(comments) {
  const container = document.querySelector('.container3');
  const commentsContainer = container.querySelector('.comments');

  // 기존 댓글을 삭제
  commentsContainer.innerHTML = '';

  // 업로드된 순서대로 번호를 추가
  const commentsWithNumber = comments.map((comment, CommentIndex) => ({
    ...comment,
    number: CommentIndex + 1
  }));

  // 번호 순으로 정렬
  const sortedComments = commentsWithNumber.sort((a, b) => a.number - b.number);

  // 각 댓글에 대해 HTML 형식으로 변환하여 추가
  sortedComments.forEach(comment => {
    const { CommentIndex, UserName, CommentContent } = comment;

    const commentElement = document.createElement('div');
    commentElement.className = 'comment bg-gray-100 p-4 mb-4 rounded-lg';

    const profileElement = document.createElement('div');
    profileElement.className = 'comment-profile flex items-center';

    const profilePictureElement = document.createElement('img');
    profilePictureElement.src = '/img/profile_picture.png';
    profilePictureElement.alt = '프로필 사진';
    profilePictureElement.className = 'w-8 h-8 rounded-full mr-2';

    const usernameElement = document.createElement('span');
    usernameElement.className = 'comment-username text-gray-700 font-semibold';
    usernameElement.textContent = UserName;

    profileElement.appendChild(profilePictureElement);
    profileElement.appendChild(usernameElement);

    const contentElement = document.createElement('div');
    contentElement.className = 'comment-content';
    contentElement.textContent = CommentContent;

    commentElement.appendChild(profileElement);
    commentElement.appendChild(contentElement);

    commentsContainer.appendChild(commentElement);
  });
}

// 댓글 추가 함수 호출
addCommentsToContainer([]);

// comment-form의 submit 이벤트 핸들러
document.getElementById('comment-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var content = document.getElementById('comment-content').value;

  // 서버로 전송할 JSON 데이터 생성
  var page = window.location.pathname.split("/").pop()

  const data = {
    Form: 'Comment',
    postid: page.split(".")[0],
    content: content
  };

  console.log(data)

  // 서버에 JSON 데이터 전송
  fetch('/Comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(comments => {
      // 댓글 리스트를 업데이트
      addCommentsToContainer(comments);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
