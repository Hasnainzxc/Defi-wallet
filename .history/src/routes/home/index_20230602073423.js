import { h } from 'preact';
import style from './style.css';

const Home = () => {
	return (
		<div class={style.home}>
			<a href="https://preactjs.com">
				<img src="../../assets/preact-logo.svg" alt="Preact Logo" height="160" width="160" />
			</a>
			<h1>Get Started Building PWAs with Preact-CLI</h1>
			<section>
				
			</section>
		</div>
	);
};

const Resource = props => {
	return (
		<a href={props.link} class={style.resource}>
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
};

export default Home;
