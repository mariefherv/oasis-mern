import { Button, ListGroupItem } from "react-bootstrap";

export default function HotlineItem({hotlineProps}) {
    const {hotlineName, hotlineAddress, hotlineNumber} = hotlineProps;
    return (
        <ListGroupItem >
            <h6>{hotlineName}</h6>
            <p><small>{hotlineAddress}</small></p>
            <Button href={'tel:'+hotlineNumber}>Call {hotlineNumber}</Button>
        </ListGroupItem>
    )
}