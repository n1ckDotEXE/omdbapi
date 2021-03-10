import React, { Component } from "react";
import axios from "axios";
import "./movie.css";
export class Movie extends Component {
	state = {
		movieInput: "",
		movieArray: [],
		isLoading: false,
		isError: false,
		errorMessage: "",
	};
	async componentDidMount() {
		let randomTitle = ["batman", "superman", "lego", "alien", "predator"];
		let randomSelectedTitleIndex = Math.floor(
			Math.random() * randomTitle.length
		);
		this.setState({
			isLoading: true,
		});
		try {
			let movieData = await axios.get(
				`http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.REACT_APP_OMBD_API_KEY}&s=${randomTitle[randomSelectedTitleIndex]}`
			);
			this.setState({
				movieArray: movieData.data.Search,
				movieInput: "",
				isLoading: false,
				isError: false,
				errorMessage: "",
			});
		} catch (e) {}
	}
	handleMovieOnChange = (event) => {
		this.setState({
			movieInput: event.target.value,
			isError: false,
			errorMessage: "",
		});
	};
	handleSearchMovieError = (data) => {
		console.log(data);
		switch (data.Error) {
			case "Movie not found!":
				return {
					response: false,
					message: "Movie Not found! check your title",
				};
			case "Too many results.":
				return {
					response: false,
					message: "Too many results please narrow your search!",
				};
			default:
				return data.Search;
		}
	};
	handleSearchMovieOnClick = async (event) => {
		//event.preventDefault();
		if (this.state.movieInput.length === 0) {
			this.setState({
				isError: true,
				errorMessage: "Please enter a movie Title!",
			});
			return;
		}
		this.setState({
			isLoading: true,
		});
		try {
			let movieData = await axios.get(
				`http://omdbapi.com/?apikey=6332b1e1&s=${this.state.movieInput}`
			);
			let Data = this.handleSearchMovieError(movieData.data);
			if (Data.response === false) {
				this.setState({
					isError: true,
					errorMessage: Data.message,
					isLoading: false,
				});
				return;
			} else {
				this.setState({
					movieArray: Data,
					movieInput: "",
					isLoading: false,
					isError: false,
					errorMessage: "",
				});
			}
		} catch (e) {
			console.log(e);
		}
	};
	showMovieArrayList = () => {
		return this.state.movieArray.map((item) => {
			return (
				<div key={item.imdbID}>
					<div>{item.Title}</div>
					<div>
						<img src={item.Poster} />
					</div>
				</div>
			);
		});
	};
	handleSearchOnEnter = async (event) => {
		if (event.key === "Enter") {
			this.handleSearchMovieOnClick();
		}
	};
	render() {
		return (
			<div style={{ marginTop: 50, textAlign: "center" }}>
				<div>
					{this.state.isError && (
						<span style={{ color: "red" }}>
							{this.state.errorMessage}
						</span>
					)}
				</div>
				<input
					style={{ width: 450 }}
					name="movieInput"
					className="movieInput"
					onChange={this.handleMovieOnChange}
					onKeyPress={this.handleSearchOnEnter}
					value={this.state.movieInput}
					//id="movieInput"
				/>
				<br />
				<button
					onClick={this.handleSearchMovieOnClick}
					style={{ margin: "25px 25px" }}
				>
					Search
				</button>
				{this.state.isLoading ? (
					<div>...Loading</div>
				) : (
					this.showMovieArrayList()
				)}
				{/* <hr /> */}
				{/* {this.state.movieArray.map((item) => {
          return <div key={item.imdbID}>{item.Title}</div>;
        })} */}
			</div>
		);
	}
}
export default Movie;
