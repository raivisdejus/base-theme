/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { ProductItemsType } from 'Type/ProductList';

import ProductCompare from './ProductCompare.component';

export const ProductCompareDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/ProductCompare/ProductCompare.dispatcher'
);

/** @namespace Component/ProductCompare/Container/mapStateToProps  */
export const mapStateToProps = (state) => ({
    products: state.ProductCompareReducer.products,
    isLoading: state.ProductCompareReducer.isLoading,
    device: state.ConfigReducer.device
});

/** @namespace Component/ProductCompare/Container/mapDispatchToProps  */
export const mapDispatchToProps = (dispatch) => ({
    fetchCompareList: () => ProductCompareDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getCompareList(dispatch)
    ),
    clearCompareList: () => ProductCompareDispatcher.then(
        ({ default: dispatcher }) => dispatcher.clearComparedProducts(dispatch)
    )
});

/** @namespace Component/ProductCompare/Container */
export class ProductCompareContainer extends PureComponent {
    static propTypes = {
        fetchCompareList: PropTypes.func.isRequired,
        clearCompareList: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        products: ProductItemsType
    };

    static defaultProps = {
        isLoading: false,
        products: []
    };

    containerFunctions = {
        getAttributes: this.getAttributes.bind(this),
        clearCompareList: this.clearCompareList.bind(this)
    };

    componentDidMount() {
        this.fetchCompareList();
    }

    fetchCompareList() {
        const { fetchCompareList } = this.props;

        fetchCompareList();
    }

    clearCompareList() {
        const { clearCompareList } = this.props;

        clearCompareList();
    }

    getAttributes() {
        const { products } = this.props;

        if (!products.length) {
            return [];
        }

        return Object.values(
            products.reduce((acc, { attributes }) => {
                Object.assign(acc, attributes);
                return acc;
            }, {})
        ).map(({ attribute_code, attribute_value, ...rest }) => ({
            ...rest,
            attribute_code,
            attribute_values: products.map(({ attributes }) => {
                const { attribute_value = null } = attributes[attribute_code] || {};
                return attribute_value;
            })
        }));
    }

    render() {
        return (
            <ProductCompare
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCompareContainer);
