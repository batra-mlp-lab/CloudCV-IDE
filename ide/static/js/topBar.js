import React from 'react';

class TopBar extends React.Component {
  render() {
    return (
      <div className="topBar">
        <div className="row">
          <div className="col-md-7 topBarHead" >
            <img src={'/static/img/logo.png'} className="img-responsive" alt="logo" id="logo"/>
          </div>
          <div className="col-md-5" >
            <div className="form-inline">
            <div className="form-group" style={{'float':'right'}}>
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle form-control" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-share" aria-hidden="true"></span>
                  </button>
                  <ul className="dropdown-menu pull-right">
                    <li><a href="#" onClick={() => this.props.loadDb()}>
                      Download
                    </a></li>
                    <li><a href="#" onClick={() => this.props.saveDb()}>
                      Upload
                    </a></li>
                  </ul>
                </div>
              </div>
              <div className="form-group" style={{'float':'right'}}>
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle form-control" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-export" aria-hidden="true"></span>
                  </button>
                  <ul className="dropdown-menu pull-right">
                    <li><a href="#" onClick={() => this.props.exportNet('caffe')}>caffe</a></li>
                    <li><a href="#" onClick={() => this.props.exportNet('keras')}>keras</a></li>
                    <li><a href="#" onClick={() => this.props.exportNet('tensorflow')}>tensorflow</a></li>
                  </ul>
                </div>
              </div>
              <div className="form-group" style={{'float':'right'}}>
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle form-control" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-import" aria-hidden="true"></span>
                  </button>
                  <ul className="dropdown-menu pull-right">
                    <li>
                        <a>
                        <label htmlFor="inputFilecaffe">caffe</label>
                        <input id="inputFilecaffe" type="file" accept=".prototxt" onChange={() => this.props.importNet('caffe', '')}/>
                        </a>
                    </li>
                    <li>
                        <a>
                        <label htmlFor="inputFilekeras">keras</label>
                        <input id="inputFilekeras" type="file" accept=".json" onChange={() => this.props.importNet('keras', '')}/>
                        </a>
                    </li>
                    <li>
                        <a>
                        <label htmlFor="inputFiletensorflow">tensorflow</label>
                        <input id="inputFiletensorflow" type="file" accept=".pbtxt" onChange={() => this.props.importNet('tensorflow', '')}/>
                        </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  exportNet: React.PropTypes.func,
  importNet: React.PropTypes.func,
  saveDb: React.PropTypes.func,
  loadDb: React.PropTypes.func
};

export default TopBar;
