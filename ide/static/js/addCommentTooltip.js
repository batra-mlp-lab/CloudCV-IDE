import React from 'react';

class AddCommentTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.addComment = this.addComment.bind(this);
  }
  addComment(event) {
    if (!('comments' in this.props.layer)) {
      this.props.layer['comments'] = [];
    }
    this.props.layer['comments'].push(this.refs.comment.value);
    this.props.onCloseCommentModal(event);
    this.props.doSharedUpdate();
  }

  render() {
      return (
        <div className="addCommentTooltiptext" style={{ textAlign: 'left', color: "#000"}}>
          <div className="row" style={{ paddingLeft: '15px', paddingRight: '10px'}}>
            <div className="col-md-2" style={{padding: '0px', paddingLeft: '6px'}}>
              <img src={'/static/img/user.png'} className="img-responsive" alt="user" height="40px" width="40px"/>
            </div>
            <div className="col-md-10" style={{ padding: '0px', paddingLeft: '10px'}}>
              <textarea ref="comment" className="CommentTextarea" placeholder="Add your comment here...">
              </textarea>
            </div>
          </div>
          <div className="row" style={{ paddingTop: '5px',paddingLeft: '15px', paddingRight: '20px'}}>
            <div className="col-md-12" style={{padding: '0px', textAlign: 'left', float: 'right' }}>
              <button className="btn btn-success text-center pull-right" id='btn-comment' onClick={this.addComment}>
                  <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> Comment
              </button>
            </div>
          </div>
        </div>
      )
  }
}

AddCommentTooltip.propTypes = {
  layer: React.PropTypes.object,
  onCloseCommentModal: React.PropTypes.func,
  doSharedUpdate: React.PropTypes.func
};

export default AddCommentTooltip;
