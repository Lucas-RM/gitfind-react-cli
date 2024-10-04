import { Header } from '../../components/Header';
import background from "../../assets/background.png";

import "./styles.css";
import ItemList from '../../components/ItemList';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="background app" />
        <div className="info" >
          <div className="area-de-busca">
            <input name="usuario" placeholder="@username" />
            <button>Buscar</button>
          </div>
          <div className="perfil">
            <img 
              src="https://avatars.githubusercontent.com/u/56799886?v=4" 
              className="image-profile" 
              alt="imagem de perfil" />
            <div>
              <h3>Lucas Marcondes</h3>
              <span>@Lucas-RM</span>
              <p>Descrição</p>
            </div>
          </div>
          <hr />
          <div>
            <h4 className="titulo-repositorio">Repositórios</h4>
            <ItemList title="Teste1" description="teste de de descrição" />
            <ItemList title="Teste1" description="teste de de descrição" />
            <ItemList title="Teste1" description="teste de de descrição" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;