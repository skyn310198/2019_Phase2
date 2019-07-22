import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search'
import * as React from 'react'

interface IState {
    input: string,
    result: any,
    body:any,
}

interface IProps {
    currentVideo:any,
    play: any
}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body:[],
            input:"",
            result:[],
        }
    }

    public search = () => {
        if(this.state.input.trim() === ""){
            this.setState({result:[]},()=>this.makeTableBody())
        }else{
            fetch("https://scriberapi.azurewebsites.net/api/Videos/SearchByTranscriptions/"+this.state.input,{
                headers:{
                    Accept:"text/plain"
                },
                method:"GET"
            }).then((response:any)=>{
                return response.json()
            }).then((response:any)=>{
                this.setState({result:response},()=>this.makeTableBody())
            })
        }
    }

    public makeTableBody = () =>{
        const toRet: any[] = []
        this.state.result.sort((a:any,b:any)=>{
            if(a.webUrl === b.webUrl){
                return 0;
            }else if(a.webUrl === this.props.currentVideo){
                return -1;
            }else if(b.webUrl === this.props.currentVideo){
                return 1;
            }else{
                return a.videoTitle.localeCompare(b.videoTitle);
            }
        })
        this.state.result.forEach((video:any) => {
            video.transcription.forEach((caption:any) => {
                toRet.push(
                    <tr onClick={()=>this.handleClick(video.webUrl,caption.startTime)}>
                        <td>{caption.startTime}</td>
                        <td>{caption.phrase}</td>
                        <td>{video.videoTitle}</td>
                    </tr>
                )
            });
        });
        if (toRet.length === 0){
            if(this.state.input.trim() === ""){
                const error = <div><p>Sorry you need to search</p></div>
                this.setState({body:error})
            }else{
                const error = <div><p>Sorry no results returned</p></div>
                this.setState({body:error})
            }
        }else{
            this.setState({body:toRet})
        }
    }

    public handleClick = (url:any,time:any) =>{
        window.scrollTo(0,0)
        this.props.play(url+"&t="+time+"s")
    }



    public render() {
        return (
            <div className="caption-area">
                <div className="caption-area">
                <div className="row">
                    <div className="col-2 justify-content-center align-self-center">
                        <h1><span className="red-heading">search</span>caption</h1>
                    </div>
                    <div className="col-10">
                        
                        <TextField
                            id="Search-Bar"
                            className="SearchBar"
                            placeholder="Search Captions"
                            margin="normal"
                            variant="outlined"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => this.search()}>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </div>
                </div>
                <br/>
                <table className="table">
                    <tr>
                        <th>Time</th>
                        <th>Caption</th>
                        <th>Video</th>
                    </tr>
                    <tbody className="captionTable">
                            {this.state.body}
                    </tbody>
                </table>
            </div>
            </div>
        )
    }
}