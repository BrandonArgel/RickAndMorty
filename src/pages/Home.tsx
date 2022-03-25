import * as React from "react";
import { Controls, Hero, Modal, Pagination } from "components";
import getCharacters from "utils/getCharacters";
import getDimension from "utils/getDimension";
import { Loader } from "assets/icons";
import styles from "./Home.module.scss";

const Characters = React.lazy(() => import("components/Characters"))
const Particles = React.lazy(() => import("components/Particles"));


const Home = () => {
	const [characters, setCharacters] = React.useState([]);
	const [character, setCharacter] = React.useState({} as any);
	const [info, setInfo] = React.useState({} as any);
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [modal, setModal] = React.useState(false);

	const [page, setPage] = React.useState(1);
	const [search, setSearch] = React.useState("");
	const [status, setStatus] = React.useState("");
	const [species, setSpecies] = React.useState("");
	const [gender, setGender] = React.useState("");

	const initialRequest = React.useCallback(async () => {
		setLoading(true);
		const { data, results, error, p } = await getCharacters({
			page,
			search,
			status,
			species,
			gender,
		});

		setCharacters(results);
		setInfo(data);
		setPage(p);
		setError(error);

		setLoading(false);
	}, [page, search, status, species, gender]);

	React.useEffect(() => {
		initialRequest();
	}, [page, search, status, species, gender, initialRequest]);

	const changeModal = async (char: any) => {
		setCharacter(char);
		if (char.origin.url) {
			const dimension = await getDimension({ url: char.origin.url });
			setCharacter((prevState: any) => ({ ...prevState, dimension }));
		} else {
			setCharacter((prevState: any) => ({ ...prevState, dimension: char.origin.name }));
		}
		setModal(true);
	};

	React.useEffect(() => {}, [character]);

	return (
		<main>
			<Hero />
			<Controls
				search={search}
				setSearch={setSearch}
				status={status}
				setStatus={setStatus}
				species={species}
				setSpecies={setSpecies}
				gender={gender}
				setGender={setGender}
			/>
			{error && (
				<div className={styles.error}>
					<p aria-live="assertive">{error}</p>
				</div>
			)}
			{loading ? (
				<div className={styles.loader}>
					<Loader />
				</div>
			) : (
				<React.Suspense fallback={<Loader />}>
					<Particles />
					<Characters characters={characters} changeModal={changeModal} />
					<Pagination loading={loading} info={info} page={page} setPage={setPage} />
				</React.Suspense>
			)}
			<Modal open={modal} setOpen={() => setModal(false)} character={character} />
		</main>
	);
};

export default Home;
