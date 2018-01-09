import React, { Component } from 'react';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';
import _debounce from './debounce';

class Carousel extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.mousemoveListener = this.mousemoveListener.bind(this);
        this.mouseupListener = this.mouseupListener.bind(this);
        this.captureMouseEvents = this.captureMouseEvents.bind(this);
        this.state = {
            currentShiftedPosition: 0,
            dragStyle: '-webkit-grab',
            previousMovementX: 0,
            mouseDown: false
        };
    }
    componentDidMount() {
        // let mouseIsDown = false;
        // document.querySelector('#carousel-container').addEventListener('mousedown', this.mousemoveListener);

            
    

        // document.querySelector('#carousel-container').addEventListener('mouseup', (event) => {
        //     this.setState({ mouseIsDown: false });
        // });
    }
    


    mousemoveListener(event) {


        const carouselWidth = document.querySelector('#carousel-container').offsetWidth;
        const imageWidth = Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2));
        const imageDivWidth = imageWidth * this.props.children.length;
        const maxImagesToShow = carouselWidth / imageWidth;


        event.preventDefault();
        if(this.state.mouseDown) this.setState({ previousMovementX: event.layerX });

        
        // if(this.state.currentShiftedPosition === 0) {
        if(this.state.previousMovementX - event.layerX > 0 && this.state.currentShiftedPosition > -imageDivWidth + Math.floor(maxImagesToShow) * imageWidth) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition - 15}, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
                
        } else if(this.state.previousMovementX - event.layerX < 0 && this.state.currentShiftedPosition < 0) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + 15}, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
        }
           
            
            
        if(this.state.mouseDown) this.setState({ mouseDown: false });     
                

            // this.setState({ currentShiftedPosition: });
        // }

            
        
        
        
    }

    mouseupListener(event) {
        console.log('MOUSE UP')
        event.stopPropagation();
        document.removeEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').removeEventListener('mousemove', this.mousemoveListener, true);
    }

    captureMouseEvents() {
        document.addEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').addEventListener('mousemove', this.mousemoveListener, true);
    }

    handleMouseDown(event) { 
        event.preventDefault();
        event.stopPropagation();
        this.setState({mouseDown: true});
            this.captureMouseEvents();
        
        
        
    }

    changeImageWidth(children) {
        return React.Children.map(children, (childNode) => {
            return React.cloneElement(childNode, { 
                style: {
                    width: this.props.imageWidth ? `${this.props.imageWidth}px` : '500px',
                    height: this.props.imageHeight ? `${this.props.imageHeight}px` : '500px'
                }
            });
        });
    }
    handleClick(event) {
        if(event.currentTarget.title === 'chevron-right') {
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', -(Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2)) * this.props.showImages) || -(500 * this.props.showImages));
            else this.handleTransform('.carousel-inside-container', 'negative');
        } else {
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2) * this.props.showImages) || 500 * this.props.showImages);
            else this.handleTransform('.carousel-inside-container', 'positive');
        }
    }

    handleTransform(target, shift) {
        
        let maxShift = null;
        const carouselWidth = document.querySelector('#carousel-container').offsetWidth;
        const imageWidth = Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2));
        const imageDivWidth = imageWidth * this.props.children.length;
        const maxImagesToShow = carouselWidth / imageWidth;
        console.log('arguments', target, shift, imageWidth, imageDivWidth, carouselWidth, this.state.currentShiftedPosition)

        if(shift === 'negative') shift = -(Math.floor(maxImagesToShow) * imageWidth);
        else if(shift === 'positive') shift = Math.floor(maxImagesToShow) * imageWidth;

        if(shift < 0) {
            if(this.state.currentShiftedPosition + (shift * 2) > -imageDivWidth) {
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                maxShift = -(imageDivWidth - (maxImagesToShow * imageWidth));
                console.log('maxshift', maxShift)
                this.setState({ currentShiftedPosition: maxShift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        } else {
            if(this.state.currentShiftedPosition + (shift) <= 0) {
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                maxShift = 0;
                this.setState({ currentShiftedPosition: maxShift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        }
        
    }

    render() { 
        let carouselStyles = {
            height: typeof this.props.carouselHeight === 'number' ? `${this.props.carouselHeight}px`: this.props.carouselHeight || 'auto',
            width: typeof this.props.carouselWidth === 'number'? `${this.props.carouselWidth}px`: this.props.carouselWidth || '90vw'
        };

        if (this.props.showImages > 0) {
            if(this.props.imageWidth) carouselStyles.width = this.props.imageWidth * this.props.showImages;
            else carouselStyles.width = 500 * this.props.showImages;
        }



        return (
            <div id="main-container">
                <div title="chevron-left" className= "chevron-left" onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
                <div id="carousel-container" style={ carouselStyles } onMouseDown={ this.handleMouseDown }>
                    <div className="carousel-inside-container" style={{cursor: this.state.dragStyle}}>
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                <div title="chevron-right" className= "chevron-right" onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
            </div>
            
        )
    }
}

export default Carousel;