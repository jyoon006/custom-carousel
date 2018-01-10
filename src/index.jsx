import React, { Component } from 'react';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';
import _throttle from './throttle';

class Carousel extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.mousemoveListener = _throttle(this.mousemoveListener.bind(this), 30);
        this.mouseupListener = this.mouseupListener.bind(this);
        this.captureMouseEvents = this.captureMouseEvents.bind(this);
        this.state = {
            currentShiftedPosition: 0,
            previousMovementX: 0,
            mouseDown: false,
            carouselWidth: null,
            imageWidth: null,
            imageDivWidth: null,
            maxImagesToShow: null,
            showLeftArrow: 'hidden',
            showRightArrow: 'initial'
        };
    }

    componentDidMount() {
        this.getImageSize(this.props.children)
        .then((resolve) =>{
            let { imageNaturalHeight, imageNaturalWidth } = this.state;
            this.setState({ 
                carouselWidth: document.querySelector('#carousel-container').offsetWidth, 
                imageNaturalHeight: resolve.imageNaturalHeight, 
                imageNaturalWidth: resolve.imageNaturalWidth,
                imageWidth: resolve.imageNaturalWidth,
                imageDivWidth: resolve.imageNaturalWidth * this.props.children.length,
                maxImagesToShow: document.querySelector('#carousel-container').offsetWidth / resolve.imageNaturalWidth
            });
        })
        .catch((error) => {
            return console.error(`Error in componentDidMount in getImageSize(): ${error}`);
        });

        // const carouselWidth = document.querySelector('#carousel-container').offsetWidth;
        // const imageWidth = this.state.imageNaturalWidth;
        // const imageDivWidth = imageWidth * this.props.children.length;
        // const maxImagesToShow = carouselWidth / imageWidth;

        // this.setState({
        //     carouselWidth: carouselWidth,
        //     imageWidth: imageWidth,
        //     imageDivWidth: imageDivWidth,
        //     maxImagesToShow: maxImagesToShow
        // });
    }

    componentWillUnmount() {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('mousemove', mousemoveListener, true);
        document.removeEventListener('mousedown', handleMouseDown, true);
        document.removeEventListener('mouseup', mouseupListener, true);
    }
 
    mousemoveListener(event) {
        event.preventDefault();
        
        if(this.state.mouseDown) this.setState({ previousMovementX: event.layerX });
        if(this.state.currentShiftedPosition < (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) this.setState({ showRightArrow: 'hidden' });
        if(this.state.currentShiftedPosition >= 0) this.setState({ showLeftArrow: 'hidden'});
        
        if(this.state.previousMovementX - event.layerX > 0 && this.state.currentShiftedPosition > (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition - 15, showLeftArrow: 'visible' }, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.WebkitTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.msTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.MozTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.OTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
                
        } else if(this.state.previousMovementX - event.layerX < 0 && this.state.currentShiftedPosition < 0) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + 15, showRightArrow: 'visible' }, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.WebkitTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.msTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.MozTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.OTransform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
        }

        if(this.state.mouseDown) this.setState({ mouseDown: false });     
       
    }

    mouseupListener(event) {
        event.stopPropagation();
        document.querySelector('.carousel-inside-container').style.willChange = 'unset';
        document.removeEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').removeEventListener('mousemove', this.mousemoveListener, true);
    }

    captureMouseEvents() {
        document.querySelector('.carousel-inside-container').style.willChange = 'transform';
        document.addEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').addEventListener('mousemove', this.mousemoveListener, true);
    }

    handleMouseDown(event) { 
        event.preventDefault();
        event.stopPropagation();
        this.setState({mouseDown: true}, () => {
            this.captureMouseEvents();
        });    
    }

    findImgElement(node) {
        if(node.type === 'img') {
            return node;
        }
        else if(node.props) {
            if(node.props.children) {
                return this.findImgElement(node.props.children);
            }
        }    
    }
    
    getImageSize(children, cb) {
        let counter = 0;
        let imageNaturalWidth = 0;
        let imageNaturalHeight = 0;
        return new Promise((resolve, reject) => {
            children.map((child) => {
                let naturalWidth, naturalHeight;
                let currentImg = this.findImgElement(child);
                let img = new Image();
                img.src = currentImg.props.src;
                img.onload = (image) => {
                    imageNaturalWidth += img.naturalWidth;
                    imageNaturalHeight += img.naturalHeight;
                    counter++;
                    if(counter === children.length) resolve({ imageNaturalWidth:imageNaturalWidth / children.length, imageNaturalHeight: imageNaturalHeight / children.length });
                }
            });
        });
    }

    changeImageWidth(children) {        
        return React.Children.map(children, (childNode) => {
            return React.cloneElement(childNode, { 
                style: {
                    width: this.state.imageNaturalWidth + 'px'|| '500px',
                    height: this.state.imageNaturalHeight + 'px' ||'500px',
                    boxSizing: 'border-box'
                }
            });
        });
    }

    handleClick(event) {
        if(event.currentTarget.className === 'chevron-right') {
            if(this.state.currentShiftedPosition === (-(this.state.imageDivWidth) + Math.floor(this.state.maxImagesToShow) * this.state.imageWidth)) return;
            this.setState({ showLeftArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', -(this.state.imageWidth) * this.props.showImages) || -(500 * this.props.showImages);
            else this.handleTransform('.carousel-inside-container', 'negative');
        } else {
            if(this.state.currentShiftedPosition === 0) return;
            this.setState({ showRightArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', this.state.imageWidth * this.props.showImages || 500 * this.props.showImages);
            else this.handleTransform('.carousel-inside-container', 'positive');
        }
    }

    handleTransform(target, shift) {
        
        let maxShift = null;
        
        if(shift === 'negative') shift = window.innerWidth < 768 ? -(Math.ceil(this.state.maxImagesToShow) * this.state.imageWidth) : -(Math.floor(this.state.maxImagesToShow) * this.state.imageWidth);
        else if(shift === 'positive') shift = window.innerWidth < 768 ? Math.ceil(this.state.maxImagesToShow) * this.state.imageWidth : Math.floor(this.state.maxImagesToShow) * this.state.imageWidth;
        
        if(shift < 0) {
            if(this.state.currentShiftedPosition + (shift * 2) > -(this.state.imageDivWidth)) {
                
                if(this.state.currentShiftedPosition + (shift) === -(this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth))) this.setState({ showRightArrow: 'hidden' });
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                maxShift = -(this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth));
                this.setState({ currentShiftedPosition: maxShift, showRightArrow: 'hidden' }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        } else {
            if(this.state.currentShiftedPosition + (shift) <= 0) {
                if(this.state.currentShiftedPosition + shift === 0) this.setState({ showLeftArrow: 'hidden' });
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                
                maxShift = 0;
                this.setState({ currentShiftedPosition: maxShift, showLeftArrow: 'hidden' }, () => {
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
                { this.props.showArrows ? null : <div className= "chevron-left" style={{ visibility: this.state.showLeftArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
                <div id="carousel-container" style={ carouselStyles } onMouseDown={ this.handleMouseDown }>
                    <div className="carousel-inside-container">
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                { this.props.showArrows ? null : <div className= "chevron-right" style={{ visibility: this.state.showRightArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
            </div>
            
        )
    }
}

export default Carousel;