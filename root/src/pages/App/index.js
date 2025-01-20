import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Header } from "../../components/Header";
import ItemList from "../../components/ItemList";

import background from "../../assets/background.png";
import "./styles.css";

// Carregar variáveis de ambiente
const isDevelopment = process.env.NODE_ENV === 'development';
const TOKEN = isDevelopment ? process.env.REACT_APP_GITHUB_TOKEN : null;
const config = TOKEN ? {
  method: "GET",
  headers: {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
} : { method: "GET" };

function App() {
	const [user, setUser] = useState("");
	const [currentUser, setCurrentUser] = useState(null);
	const [repos, setRepos] = useState(null);
	const [filteredRepos, setFilteredRepos] = useState(null);
	const [filters, setFilters] = useState({
		dateSort: "",
		alphabeticalSort: "a-z",
		starsFilter: false,
	});

	const handleGetData = async () => {
		try {
			const userData = await fetch(
				`https://api.github.com/users/${user}`,
				config
			);
			const newUser = await userData.json();

			if (newUser.name) {
				const { avatar_url, name, bio, login } = newUser;
				setCurrentUser({ avatar_url, name, bio, login });

				const reposPerPage = 30;
				const numberOfRepos = newUser.public_repos;
				const numberOfPages = Math.ceil(numberOfRepos / reposPerPage);

				let newRepos = [];
				for (let i = 1; i <= numberOfPages; i++) {
					const reposData = await fetch(
						`https://api.github.com/users/${user}/repos?page=${i}`,
						config
					);
					if (!reposData.ok)
						throw new Error(
							`StatusCode (${reposData.status}) - Erro ao buscar dados!`
						);

					const data = await reposData.json();
					if (data.length > 0) {
						newRepos.push(...data);
					}
				}

				setRepos(newRepos);
				applyFilters(newRepos, filters);
			} else {
				toast("Usuário não encontrado!");
			}
		} catch (error) {
			toast(error.message ?? "Erro ao buscar dados!");
		}
	};

	const applyFilters = async (data, activeFilters) => {
		let filtered = [...data];

		// Filtro por estrelas
		if (activeFilters.starsFilter) {
			filtered = await filterListByStars(filtered);
		}

		// Ordenação por data
		if (activeFilters.dateSort) {
			if (activeFilters.starsFilter) {
				setFilters({
					dateSort: activeFilters.dateSort,
					alphabeticalSort: "",
					starsFilter: activeFilters.starsFilter,
				});
			}
			filtered = filterListByDate(filtered, activeFilters.dateSort);
		}

		// Ordenação alfabética
		if (activeFilters.alphabeticalSort) {
			filtered = sortListAlphabetically(
				filtered,
				activeFilters.alphabeticalSort
			);
		}

		setFilteredRepos(filtered);
	};

	const handleFilterChange = (e, filterType) => {
		let newFilters = {
			...filters,
			[filterType]:
				e.target.type === "checkbox"
					? e.target.checked
					: e.target.value,
		};

		if (newFilters.dateSort && newFilters.alphabeticalSort) {
			toast(
				"Os dados não podem serem ordenados por Data e Alfabeticamente!"
			);
			newFilters[filterType] = "";
		}

		setFilters(newFilters);
		applyFilters(repos, newFilters);
	};

	// Função para filtrar por data em ordem de mais ou menos recente da Criação ou Atualização
	const filterListByDate = (list, order) => {
		return list.sort((a, b) => {
			switch (order) {
				case "criado-mais-recente":
					return new Date(b.created_at) - new Date(a.created_at);
				case "criado-menos-recente":
					return new Date(a.created_at) - new Date(b.created_at);
				case "atualizado-mais-recente":
					return new Date(b.pushed_at) - new Date(a.pushed_at);
				case "atualizado-menos-recente":
					return new Date(a.pushed_at) - new Date(b.pushed_at);
				default:
					return 0;
			}
		});
	};

	// Função para filtrar por estrelas ('stargazers_count') >= 1
	const filterListByStars = async (list) => {
		// Criar uma lista de promessas
		const promises = list.map(async (item) => {
			const reposData = await fetch(item.stargazers_url, config);
			const data = await reposData.json();

			const isStarredByAuthor =
				data.filter((d) => d.login === item.owner.login).length > 0;

			return item.stargazers_count >= 1 && isStarredByAuthor
				? item
				: null;
		});

		// Resolver todas as promessas e filtrar os resultados
		const resolved = await Promise.all(promises);
		const filtered = resolved.filter((item) => item !== null);

		return filtered;
	};

	// Função para ordenar alfabeticamente
	const sortListAlphabetically = (list, order = "a-z") => {
		return list.sort((a, b) => {
			const comparison = a.name.localeCompare(b.name);
			return order === "z-a" ? -comparison : comparison;
		});
	};

	return (
		<div className="App">
			<Header />

			<div className="conteudo">
				<img
					src={background}
					className="background"
					alt="background app"
				/>

				<div className="info">
					<div className="area-de-busca">
						<input
							name="usuario"
							value={user}
							onChange={(event) => setUser(event.target.value)}
							placeholder="@username"
						/>

						<button onClick={handleGetData}>Buscar</button>
					</div>

					<ToastContainer theme="dark" />

					{currentUser?.name ? (
						<>
							<div className="perfil">
								<img
									src={currentUser.avatar_url}
									className="image-profile"
									alt="imagem de perfil"
								/>
								<div>
									<h3>{currentUser.name}</h3>
									<span>@{currentUser.login}</span>
									<p>{currentUser.bio}</p>
								</div>
							</div>

							<hr />
						</>
					) : null}

					{filteredRepos?.length ? (
						<div>
							<h4 className="titulo-repositorio">Repositórios</h4>

							<div className="filtros">
								<div className="filtro">
									<label htmlFor="dateSort">
										Ordenar por Data:
									</label>

									<div className="custom-select">
										<select
											id="dateSort"
											value={filters.dateSort}
											onChange={(e) =>
												handleFilterChange(
													e,
													"dateSort"
												)
											}
										>
											<option value="">
												Selecione a Ordem
											</option>
											<option value="criado-mais-recente">
												Mais Recente (criado)
											</option>
											<option value="criado-menos-recente">
												Menos Recente (criado)
											</option>
											<option value="atualizado-mais-recente">
												Mais Recente (atualizado)
											</option>
											<option value="atualizado-menos-recente">
												Menos Recente (atualizado)
											</option>
										</select>
									</div>
								</div>

								<div className="filtro">
									<label htmlFor="alphabeticalSort">
										Ordenar Alfabeticamente:
									</label>

									<div className="custom-select">
										<select
											id="alphabeticalSort"
											value={filters.alphabeticalSort}
											onChange={(e) =>
												handleFilterChange(
													e,
													"alphabeticalSort"
												)
											}
										>
											<option value="">
												Selecione a Ordem
											</option>
											<option value="a-z">A-Z</option>
											<option value="z-a">Z-A</option>
										</select>
									</div>
								</div>

								<div className="filtro filtro-estrela">
									<label htmlFor="starsFilter">
										<input
											type="checkbox"
											id="starsFilter"
											checked={filters.starsFilter}
											onChange={(e) =>
												handleFilterChange(
													e,
													"starsFilter"
												)
											}
										/>
										Apenas com Estrelas
									</label>
								</div>
							</div>

              <div className="repos-container">
                <span className="repos-count">{filteredRepos.length}</span>
                <span className="repos-label">Repositórios</span>
              </div>

							{filteredRepos.map((repo) => (
								<ItemList
									key={repo.id}
									link={repo.html_url}
									title={repo.name}
									description={repo.description}
								/>
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default App;
