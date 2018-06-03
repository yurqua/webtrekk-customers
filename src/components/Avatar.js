import React from 'react';
import PropTypes from 'prop-types';

class Avatar extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
          customerID: props.customerID,
          gender: props.gender,
          size: props.size,
          isLoading: props.isLoading
        }
    }

    //The component has to actively listen to the changes in its parent as the loading state will end as well as the data will be loaded at some point in time
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isLoading: nextProps.isLoading,
            gender: nextProps.gender,
        };
    }      

    render() {
        const pixelSize = this.state.size === 'small' ? '72' : '172'
        const genderURL = this.state.gender === "m" ? "men" : "women"
        //An avatar from the open API substitutes here the real photos handling. The API provides images of two genders only, so for now the 'Other' state remains only partly supported
        const avatarSrc = this.state.gender === "o" ? null : 'https://randomuser.me/api/portraits/' + genderURL + '/' + this.state.customerID + '.jpg';
        const avatar = this.state.gender !== 'o' ? (
          <div className={'avatar' + (this.state.isLoading ? ' invisible' : '')}>
            <img src={avatarSrc} alt="Customer avatar" width={pixelSize} height={pixelSize} />
          </div>
        ) : (
          <div className={'avatar' + (this.state.isLoading ? ' invisible' : '')}></div>
        )
        return (
            <div>
                {avatar}
            </div>
        )
    }
}

Avatar.propTypes = {
    customerID: PropTypes.number.isRequired,
    gender: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default Avatar;