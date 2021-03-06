import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getTokenFromUrl } from "./spotify";
import Login from "./components/Login";
import Player from "./components/Player";
import { useDataLayerValue } from "./DataLayer";
import "./App.css";

const spotify = new SpotifyWebApi();

const App = () => {
	const [{ user, token }, dispatch] = useDataLayerValue();
	useEffect(() => {
		const hash = getTokenFromUrl();
		window.location.hash = "";
		const _token = hash.access_token;

		if (_token) {
			dispatch({
				type: "SET_TOKEN",
				token: _token,
			});

			spotify.setAccessToken(_token);

			spotify.getMe().then((user) => {
				dispatch({
					type: "SET_USER",
					user: user,
				});
			});

			spotify.getUserPlaylists().then((playlists) => {
				dispatch({
					type: "SET_PLAYLISTS",
					playlists: playlists,
				});
			});

			spotify
				.getPlaylist("37i9dQZEVXcIazxmbLIbQX")
				.then((response) => {
					dispatch({
						type: "SET_DISCOVER_WEEKLY",
						discover_weekly: response,
					});
				});
		}
	}, []);
	return (
		<div className="app">
			{token ? <Player spotify={spotify} /> : <Login />}
		</div>
	);
};

export default App;
