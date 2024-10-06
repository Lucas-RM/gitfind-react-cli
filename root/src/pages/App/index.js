import { useState } from 'react';
import { Header } from '../../components/Header';
import background from "../../assets/background.png";
import "./styles.css";
import ItemList from '../../components/ItemList';

function App() {
  const [user, setUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [filteredRepos, setFilteredRepos] = useState(null);
  const [sortOrder, setSortOrder] = useState(''); // Estado para o tipo de ordenação

  const handleGetData = async () => {
    const userData = await fetch(`https://api.github.com/users/${user}`);
    const newUser = await userData.json();

    if (newUser.name) {
      const { avatar_url, name, bio, login } = newUser;
      setCurrentUser({ avatar_url, name, bio, login });

      const reposData = await fetch(`https://api.github.com/users/${user}/repos`);
      const newRepos = await reposData.json();

      // Ordenando os dados alfabeticamente usando localeCompare
      const sortedAlphabetically = newRepos.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      if (newRepos.length) {
        setRepos(sortedAlphabetically);
        setFilteredRepos(sortedAlphabetically);
      }
    }
  };

  // Função para filtrar por data em ordem de mais ou menos recente da Criação ou Atualização
  const handleSortByDate = (order) => {
    const sortedByDate = [...repos].sort((a, b) => {
      switch (order) {
        case 'criado-mais-recente':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'criado-menos-recente':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'atualizado-mais-recente':
          return new Date(b.pushed_at) - new Date(a.pushed_at);
        case 'atualizado-menos-recente':
          return new Date(a.pushed_at) - new Date(b.pushed_at);
        default:
          return 0;
      }
    });
    
    setFilteredRepos(sortedByDate);
  };

  // Função para filtrar por 'stargazers_count' maior ou igual a 1
  const filterByStars = () => {
    const filteredByStars = repos.filter(item => item.stargazers_count >= 1);
    setFilteredRepos(filteredByStars);
  };

  // Função para ordenar alfabeticamente
  const handleSortAlphabetically = () => {
    const sortedAlphabetically = [...repos].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredRepos(sortedAlphabetically);
  };

  // Função para tratar a mudança da opção selecionada no select
  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order); // Atualiza o estado
    handleSortByDate(order); // Filtra de acordo com a opção selecionada
  };

  return (
    <div className="App">
      <Header />

      <div className="conteudo">
        <img src={ background } className="background" alt="background app" />

        <div className="info" >
          <div className="area-de-busca">
            <input 
              name="usuario" 
              value={ user }
              onChange={ (event) => setUser(event.target.value) }
              placeholder="@username" />

            <button onClick={ handleGetData }>Buscar</button>
          </div>

          {currentUser?.name ? (
            <>
              <div className="perfil">
                <img 
                  src={currentUser.avatar_url} 
                  className="image-profile" 
                  alt="imagem de perfil" />
                <div>
                  <h3>{ currentUser.name }</h3>
                  <span>@{ currentUser.login }</span>
                  <p>{ currentUser.bio }</p>
                </div>
              </div>
              
              <hr />
            </>
          ) : null}

          {filteredRepos?.length ? (
            <div>
              <h4 className="titulo-repositorio">Repositórios</h4>

              <div className="filtros">
                <div className="filtro-ordenar-data">
                  <label htmlFor="sortOrder">Ordenar por Data: </label>

                  <div className="custom-select">
                    <select id="sortOrder" value={ sortOrder } onChange={ handleSortChange }>
                      <option value="">Selecione a Ordem</option>
                      <option value="criado-mais-recente">Mais Recente (criado)</option>
                      <option value="criado-menos-recente">Menos Recente (criado)</option>
                      <option value="atualizado-mais-recente">Mais Recente (atualizado)</option>
                      <option value="atualizado-menos-recente">Menos Recente (atualizado)</option>
                    </select>
                  </div>

                  <span className="select-focus"></span>
                </div>

                <button onClick={ filterByStars }>Filtrar por Estrelas</button>
                <button onClick={ handleSortAlphabetically }>Ordenar Alfabeticamente</button>
              </div>

              {filteredRepos.map(repo => (
                <ItemList link={ repo.html_url } title={ repo.name } description={ repo.description } />
              ))}
            </div> 
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;