import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 2rem;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    min-width: 300px;
  }

  input {
    margin-bottom: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 24px;
    color: #444;
    padding: 0 15px;
    width: 70%;
  }
  
  input:focus {
    outline: none;
  }

  button {
    margin: 10px;
    background-color: #f05a5b;
    border: 0;
    border-radius: 4px;
    height: 24px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background-color: #e14f50;
  }

  span {
    color: #757575;
    font-size: 14px;
  }
`