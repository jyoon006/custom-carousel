import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';
import _throttle from './throttle';
import _debounce from './debounce';

class Carousel extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.mousemoveListener = _throttle(this.mousemoveListener.bind(this), 30);
        this.mouseupListener = this.mouseupListener.bind(this);
        this.captureMouseEvents = this.captureMouseEvents.bind(this);
        this.handleCarouselResize = this.handleCarouselResize.bind(this);
        this.state = {
            currentShiftedPosition: 0,
            previousMovementX: 0,
            mouseDown: false,
            showLeftArrow: 'hidden',
            showRightArrow: 'initial',
            imageNaturalWidth: null,
            imageNaturalHeight: null,
            carouselWidth: null,
            imageWidth: null,
            imageDivWidth: null,
            maxImagesToShow: null
        };
    }

    handleCarouselResize() {
        let domNode = this.findReactDomNode('carouselContainer');
        let maxImagesToShow = domNode.offsetWidth / this.state.imageWidth;
        let isResizedWidthSmaller = domNode.offsetWidth < this.state.carouselWidth ? true : false;
        let resizedImageShift = 0;

        if(!isResizedWidthSmaller && (-(this.state.currentShiftedPosition) >= (this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth)))) {
            resizedImageShift = this.state.currentShiftedPosition + (domNode.offsetWidth - this.state.carouselWidth);
        }

        this.setState({
            maxImagesToShow: maxImagesToShow,
            carouselWidth: domNode.offsetWidth,
            showRightArrow: isResizedWidthSmaller ? 'visible' : null,
            currentShiftedPosition: !isResizedWidthSmaller ? resizedImageShift : this.state.currentShiftedPosition
        }, () => {
            let shiftDomNode = this.findReactDomNode('carouselInsideContainer');
            
            shiftDomNode.style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
            
        });
    }

    componentDidMount() {
        window.addEventListener('resize', _debounce(this.handleCarouselResize, 1000));

        this.getImageSize(this.props.children)
        .then((resolve) =>{
            let carouselWidth = document.querySelector('#carousel-container').offsetWidth;
            let imageNaturalHeight = resolve.imageNaturalHeight;
            let imageNaturalWidth = resolve.imageNaturalWidth;
            let imageWidthToCarouselWidthRatio = resolve.imageNaturalWidth / carouselWidth; 
            let resizedImageWidth = imageNaturalWidth * (1 - imageWidthToCarouselWidthRatio);
            let imageDivWidth = (resizedImageWidth + 15) * this.props.children.length;
            let maxImagesToShow = carouselWidth / resizedImageWidth;
            let resizedImageHeight = (resizedImageWidth + 15) * (imageNaturalHeight / imageNaturalWidth);

            if(resizedImageHeight < 200) {
                resizedImageHeight = 200;
                resizedImageWidth = (imageNaturalWidth / imageNaturalHeight) * resizedImageHeight;
                imageDivWidth = (resizedImageWidth + 15) * this.props.children.length;
                maxImagesToShow = carouselWidth / resizedImageWidth < 1 ? 1 : carouselWidth / resizedImageWidth;
            }

            this.setState({ 
                carouselWidth: carouselWidth, 
                imageNaturalHeight: imageNaturalHeight, 
                imageNaturalWidth: imageNaturalWidth,
                imageWidth: resizedImageWidth,
                imageHeight: resizedImageHeight,
                imageDivWidth: imageDivWidth,
                maxImagesToShow: maxImagesToShow
            });
        })
        .catch((error) => {
            return console.error(`Error in componentDidMount in getImageSize(): ${error}`);
        });
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
        if(this.state.currentShiftedPosition <= (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) this.setState({ showRightArrow: 'hidden' });
        if(this.state.currentShiftedPosition >= 0) this.setState({ showLeftArrow: 'hidden'});
        
        if(this.state.previousMovementX - event.layerX > 0 && this.state.currentShiftedPosition > (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition - 30, showLeftArrow: 'visible' })
                
        } else if(this.state.previousMovementX - event.layerX < 0 && this.state.currentShiftedPosition < 0) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + 30, showRightArrow: 'visible' })
        }

        this.handleTranslateAnimation('carouselInsideContainer', this.state.currentShiftedPosition, '0.1s linear');
        if(this.state.mouseDown) this.setState({ mouseDown: false });
    }

    findReactDomNode(target) {
        let ref = this.refs[target];
        return ReactDOM.findDOMNode(ref);
    }

    mouseupListener(event) {
        let domNode = this.findReactDomNode('carouselInsideContainer');
            
        event.stopPropagation();
        domNode.style.willChange = 'unset';
        document.removeEventListener('mouseup', this.mouseupListener, true);
        domNode.removeEventListener('mousemove', this.mousemoveListener, true);
    }

    captureMouseEvents() {
        let domNode = this.findReactDomNode('carouselInsideContainer');

        domNode.style.willChange = 'transform';
        document.addEventListener('mouseup', this.mouseupListener, true);
        domNode.addEventListener('mousemove', this.mousemoveListener, true);
    }

    handleMouseDown(event) { 
        event.preventDefault();
        event.stopPropagation();
        this.setState({mouseDown: true}, () => {
            this.captureMouseEvents();
        });    
    }

    findImgElement(node) {

        if(node.length > 1) {
            for(let i = 0; i < node.length; i++) {
                return this.findImgElement(node[i]);
            }
        } else {
            if(node.type === 'img') {
                return node;
            }
            else if(node.props) {
                if(node.props.children) {
                    return this.findImgElement(node.props.children);
                }
            }    
        }

        
    }
    
    getImageSize(children) {
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
                    width: `${this.state.imageWidth}px`|| '500px',
                    height: `${this.state.imageHeight}px` ||'500px',
                    minWidth: `${this.state.imageWidth * .5}px`,
                    minHeight: `${this.state.imageHeight * .5}px`,
                    boxSizing: 'border-box',
                    margin: '0 15px 0 0'
                }
            });
        });
    }

    handleClick(event) {
        if(event.currentTarget.className === 'chevron-right') {
            if(this.state.currentShiftedPosition === (-(this.state.imageDivWidth) + Math.floor(this.state.maxImagesToShow) * this.state.imageWidth)) return;
            this.setState({ showLeftArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('carouselInsideContainer', -(this.state.imageWidth) * this.props.showImages) || -(500 * this.props.showImages);
            else this.handleTransform('carouselInsideContainer', 'negative');
        } else {
            if(this.state.currentShiftedPosition === 0) return;
            this.setState({ showRightArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('carouselInsideContainer', this.state.imageWidth * this.props.showImages || 500 * this.props.showImages);
            else this.handleTransform('carouselInsideContainer', 'positive');
        }
    }

    handleTransform(target, shift) {
        let maxShift = null;
        let domNode = this.findReactDomNode(target);
        if(shift === 'negative') shift = window.innerWidth < 768 ? -(Math.floor(this.state.maxImagesToShow) * this.state.imageWidth + 15) : -(Math.floor(this.state.maxImagesToShow) * (this.state.imageWidth + 15));
        else if(shift === 'positive') shift = window.innerWidth < 768 ? Math.floor(this.state.maxImagesToShow) * this.state.imageWidth + 15 : Math.floor(this.state.maxImagesToShow) * (this.state.imageWidth + 15);

        if(shift < 0) {
            if(this.state.currentShiftedPosition + (shift * 2) > -(this.state.imageDivWidth)) {
                if(this.state.currentShiftedPosition + (shift) === -(this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth))) this.setState({ showRightArrow: 'hidden' });
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    domNode.style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    domNode.style.transition = '0.2s ease-in'; 
                });
            } else {                
                maxShift = -(this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth));
                this.setState({ currentShiftedPosition: maxShift, showRightArrow: 'hidden', resized: false }, () => {
                    domNode.style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    domNode.style.transition = '0.2s ease-in';
                });
            }

            this.handleTranslateAnimation(target, this.state.currentShiftedPosition, '0.2s ease-in');
        } else {
            if(this.state.currentShiftedPosition + (shift) <= 0) {
                if(this.state.currentShiftedPosition + shift === 0) this.setState({ showLeftArrow: 'hidden' });
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    domNode.style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    domNode.style.transition = '0.2s ease-in';
                });
            } else {
                
                maxShift = 0;
                this.setState({ currentShiftedPosition: maxShift, showLeftArrow: 'hidden' }, () => {
                    domNode.style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    domNode.style.transition = '0.2s ease-in';
                });
            }
        }
        
    }

    handleTranslateAnimation(target, currentShiftedPosition, transitionOptions) {
        
        let domNode = this.findReactDomNode(target);

        domNode.style.transform = `translateX(${currentShiftedPosition}px)`;
        // document.querySelector(target).style.WebkitTransform = `translateX(${currentShiftedPosition}px)`;
        // document.querySelector(target).style.msTransform = `translateX(${currentShiftedPosition}px)`;
        // document.querySelector(target).style.MozTransform = `translateX(${currentShiftedPosition}px)`;
        // document.querySelector(target).style.OTransform = `translateX(${currentShiftedPosition}px)`;
        domNode.style.transition = transitionOptions; 
    }

    render() { 
        let carouselStyles = {
            height: typeof this.props.carouselHeight === 'number' ? `${this.props.carouselHeight}px`: this.props.carouselHeight || 'auto',
            width: typeof this.props.carouselWidth === 'number'? `${this.props.carouselWidth}px`: this.props.carouselWidth || '90vw'
        };

        if (this.props.showImages > 0) {
            if(this.state.imageWidth) carouselStyles.width = this.state.imageWidth * this.props.showImages;
            else carouselStyles.width = 500 * this.props.showImages;
        }

        return (
            <div id="main-container" ref="mainContainer">
                { this.props.showArrows ? null : <div className= "chevron-left" ref="chevronLeft" style={{ visibility: this.state.showLeftArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
                <div id="carousel-container" ref="carouselContainer" style={ carouselStyles } onMouseDown={ this.handleMouseDown }>
                    <div className="carousel-inside-container" ref="carouselInsideContainer">
                    
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                { this.props.showArrows ? null : <div className= "chevron-right" ref="chevronRight" style={{ visibility: this.state.showRightArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
            </div>
            
        )
    }
}

export default Carousel;