import styles from './card.module.css'
const Cards = (props) => {
    return(
        <div className={styles.card}>
            <h2>{props.type}</h2>
            <hr/>
            <h1>{props.value}</h1>
        </div>
    )
}
export default Cards;