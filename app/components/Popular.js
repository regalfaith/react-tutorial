var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

function SelectLanguage(props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

  return (
    <div>
      <ul className='languages'>
        {languages.map((lang) => {
          return(
            <li
              style={lang === props.selectedLanguage ? { color: '#01dd31'}: null}
              onClick={props.onSelect.bind(null, lang)}
              key={lang}>
              {lang}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RepoGrid(props) {
  return(
    <div>
      <ul className='popular-list'>
        {props.repos.map(function(repo, index) {
          return(
            <li key={repo.name} className='popular-item'>
              <div className='pouplar-rank'>#{index + 1}</div>
              <ul className='space-list-items'>
                <li>
                  <img
                    className='avatar'
                    src={repo.owner.avatar_url}
                    alt={'Avatar for ' + repo.owner.login} />
                </li>
                <li><a href={repo.html_url}>{repo.name}</a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} start</li>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}


SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(lang) {
    this.setState(() => {
      return {
        selectedLanguage: lang,
        repos: null
      };
    });

    api.fetchPopularRepos(lang)
    .then(function(repos) {
        this.setState(function() {
          return {
            repos: repos
          }
        })
      }.bind(this));
  }

  render() {

    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!this.state.repos
          ? <p>LOADING</p>
          : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

module.exports = Popular;
