import { Link } from 'react-router-dom'
import { Header } from './styles'


export default function() {
  return (<>
    <Header>
      <div className='headerContent'>
        <div className='logo'>
          <h1>Lê Bloguê, lê?</h1> 
        </div>
        <nav>
          <ul>
            <li><Link to={"/"}>Home</Link></li>
          </ul>
        </nav>
      </div>
    </Header>
  </>)
}