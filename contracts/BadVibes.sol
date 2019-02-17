pragma solidity 0.5.0;

import "./zeppelin/lifecycle/Killable.sol";

contract BadVibes is Killable {
  struct User {
    string username;
    uint[] postIndexes;
  }

  mapping(address => User) private users;

  struct Post {
    string message;
    address author;
  }

  Post[] public posts;

  modifier onlyPublic() {
    require(
      !isUser(msg.sender),
      "sender is authorized"
    );
    _;
  }

  modifier onlyAuthenticated() {
    require(
      isUser(msg.sender),
      "sender is not authorized"
    );
    _;
  }

  event LogNewPost(address indexed author, string message, uint index);

  function join(string memory username) public onlyPublic returns(bool result) {
    if (isUser(msg.sender)) {
      return false;
    }

    users[msg.sender].username = username;
    return true;
  }

  function createPost(string memory message) public onlyAuthenticated returns(uint index) {
    Post memory post = Post(message, msg.sender);
    posts.push(post);

    users[msg.sender].postIndexes.push(posts.length - 1);

    emit LogNewPost(msg.sender, message, posts.length - 1);

    return posts.length - 1;
  }

  function isUser(address user) public view returns(bool result) {
    return bytes(users[user].username).length > 0;
  }

  function getUsername(address user) public view returns(string memory username) {
    return users[user].username;
  }

  function getPostCount() public view returns(uint count) {
    return posts.length;
  }

  function getPostAtIndex(uint index) public view returns(string memory message, address author) {
    return (
      posts[index].message,
      posts[index].author
    );
  }

  function getPostOfUserCount(address user) public view returns(uint count) {
    if (isUser(user)) {
      return users[user].postIndexes.length;
    }

    return 0;
  }

  function getPostOfUserAtIndex(address user, uint index) public view returns(uint postIndex) {
    return users[user].postIndexes[index];
  }
}
