import React from 'react';

function saveAs(uri, filename) {
    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = uri;
        link.click();
        document.body.removeChild(link); //remove the link when done

    } else {
        location.replace(uri);
    }
}

class ZipDownloadButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: null,
            fileData: null,
        };
        this._onGenerate = this._onGenerate.bind(this);
        this._donePreparing = this._donePreparing.bind(this);
        this._onDownload = this._onDownload.bind(this);
    }

    _onGenerate(){
        this.setState({status: 'zipping', fileData: null});
        this.props.genFile(this._donePreparing);
    }

    _donePreparing(fileData) {
        this.setState({
            status: 'downloading',
            fileData: fileData,
        });

        this._onDownload();
        //console.log(this.state, this.props);
    }

    _onDownload() {

        var fileData = (this.props.fileData || (this.props.async ? this.state.fileData : this.props.genFile()));

        if (!fileData) {
            return false;
        }
        var blob = new Blob([fileData.contents], {type: fileData.mime});
        var url = URL.createObjectURL(blob);
        saveAs(url, fileData.filename);
        this.props.onDownloaded && this.props.onDownloaded();

        this.setState({
          fileData: null,
          status: null
        })
    }

    render () {
        // need one or the other
        if (!this.props.genFile && !this.props.fileData) {

          return (<em>Invalid configuration for download button</em>
                );
        }

        var style = this.props.style;
        var cls = 'DownloadButton ' + (this.props.className || '');

        if (this.state.status === 'downloading') {

            var title = this.props.downloadingTitle;

            if ('function' === typeof title) {
                title = title(this.props.fileData || this.state.fileData)

            }

            // return (<button style={style} onClick={this._onDownload} className={cls}>
            //             {title}
            //         </button>);
            return (<button style={style} className={cls}>{title}</button>);
        }

        if (this.state.status === 'zipping') {
            return (<button style={style} className={cls + ' DownloadButton-loading'}>{this.props.zippingTitle}</button>);
        }

        return (<button style={style} onClick={this._onGenerate} className={cls + ' DownloadButton-generate'}>{this.props.initTitle}</button>);
    }

}

ZipDownloadButton.propTypes = {
    fileData: React.PropTypes.object,
    genFile: React.PropTypes.func,
    async: React.PropTypes.bool,
    generateTitle: React.PropTypes.string,
    downloadTitle: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
    loadingTitle: React.PropTypes.string,
    onDownloaded: React.PropTypes.func,
}

ZipDownloadButton.defaultProps = {
    async: false,
    downloadingTitle: 'Downloading...',
    initTitle: 'Download',
    zippingTitle: 'Zipping...',

}

export default ZipDownloadButton;
