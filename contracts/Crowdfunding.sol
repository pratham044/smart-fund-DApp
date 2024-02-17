// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {

    address public owner ;
    uint public projectCount ;
    uint public projectTax ;
    uint public balance ;
    projectStruct[] projects;
    statsStruct public stats ;

    mapping( address => projectStruct[] ) projectsof ;
    mapping( uint => backerStruct[] ) backersof;
    mapping( uint => bool ) projectExist ;

    constructor(uint project_tax ){
        owner = msg.sender ;
        projectCount = 0 ;
        projectTax = project_tax ;
    }

    struct statsStruct{
        uint totalProjects;
        uint totalBackings;
        uint totalDonations;
    }
    enum statusEnum{
        OPEN,
        DELETED,
        REVERTED,
        PAIDOUT,
        APPROVED    
    }

    struct projectStruct{
        address  owner ;
        uint id;
        string title ;
        string description ;
        string imageUrl ;
        uint target ;
        uint raised ;
        uint timestamp ;
        uint expiresAt ;
        uint backers ;
        statusEnum status ;
    }

    struct backerStruct{
        address owner ;
        uint contribution;
        bool refunded;
        uint timestamp ;
    }

    modifier ownerOnly(){
        require(msg.sender == owner , "owner reserved only" );
        _;
    }


     event Action (
        uint256 id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );

    function createProject( string memory _title , string memory _description , string memory image_url , uint _target , uint expires_at  ) public returns(bool){

        // conditions checking
        require(bytes(_title).length > 0 , "enter valid title" );
        require(bytes(_description).length > 0 , "Enter valid Description ");
        require(bytes(image_url).length > 0 , "Enter Valid url" );
        require( _target > 0 ether , " Target should be greater than  0 " );
        require( expires_at > block.timestamp , "Invalid date" );

        // create project with struct 
        projectStruct memory project ;
        project.id = projectCount ;
        project.owner = msg.sender ;
        project.title = _title ;
        project.description = _description ;
        project.imageUrl = image_url ;
        project.expiresAt = expires_at ;
        project.target = _target ;
        project.timestamp = block.timestamp ;
        
        //add on 
        projects.push(project) ;
        projectExist[projectCount] = true;
        projectsof[msg.sender].push(project) ;

        stats.totalProjects++ ;
        emit Action( projectCount++, "project created", msg.sender , block.timestamp );
        return true;
    }

    function updateProject( uint id , string memory _title , string memory _description , string memory image_url  , uint expires_at  ) public returns(bool){

        // conditions checking
        require(bytes(_title).length > 0 , "enter valid title" );
        require(bytes(_description).length > 0 , "Enter valid Description ");
        require(bytes(image_url).length > 0 , "Enter Valid url" );
        require( expires_at > block.timestamp , "Invalid date" );

        projects[id].title = _title ;
        projects[id].description = _description ;
        projects[id].imageUrl = image_url ;
        projects[id].expiresAt = expires_at ;

        emit Action( id , "project updated", msg.sender , block.timestamp );
        return true;
    }

    function deleteProject( uint _id ) public returns(bool){
        require( projects[_id].status == statusEnum.OPEN ,"project already expired" );
        require( projects[_id].owner == msg.sender , "Unauthorised User" );

        projects[_id].status = statusEnum.DELETED ; //project deleted in between leads to refund to all 
        performRefund( _id ); // Refund on Deleting a Project

        emit Action(_id , "Project Deleted" , msg.sender , block.timestamp );
        return true ;
    }

    function performRefund (uint _id) internal {
        
        for( uint i = 0 ; i<backersof[_id].length ; i++ ){
            address _owner = backersof[_id][i].owner ;
            uint _contri = backersof[_id][i].contribution ;

            payTo( _owner , _contri );
            backersof[_id][i].refunded = true ;
            backersof[_id][i].timestamp = block.timestamp ;

            stats.totalBackings--;
            stats.totalDonations -= _contri ;

        }
    }

    function backProject(uint _id ) public payable returns(bool){

        require( projectExist[_id] == true , "Project doesn't exist" );
        require( msg.value > 0 ether , "Amount should be more than 0 ethers " );
        require(projects[_id].status == statusEnum.OPEN , "Project closed" );

        stats.totalBackings += 1 ;
        stats.totalDonations += msg.value ;

        projects[_id].raised += msg.value ;
        projects[_id].backers += 1 ;

        backersof[_id].push(backerStruct( msg.sender ,msg.value , false, block.timestamp ));
        emit Action(_id , "Project Backed" , msg.sender , block.timestamp );

        if(projects[_id].raised >= projects[_id].target ){

            balance += projects[_id].raised ;
            performPayout(_id);
            projects[_id].status = statusEnum.APPROVED ;
            return true ;
        }

        if( block.timestamp >= projects[_id].expiresAt ){
            projects[_id].status = statusEnum.REVERTED ;
            performRefund(_id);
            return true ;
        }

        return true ;
    }

    function performPayout( uint _id ) internal {
        uint raised_ = projects[_id].raised ;
        uint tax = ( raised_ * projectTax )/100 ;

        payTo(owner , tax);
        payTo( projects[_id].owner , (raised_ - tax ));
        projects[_id].status = statusEnum.PAIDOUT ;

        balance -= raised_ ;
        emit Action( _id , "Amount has been Paidout " , msg.sender , block.timestamp );
    }

    function requestRefund( uint id ) public returns(bool){
        require(
            projects[id].status != statusEnum.REVERTED ||
            projects[id].status != statusEnum.DELETED,
            "Project not marked as revert or delete"
        );

        projects[id].status = statusEnum.REVERTED;
        performRefund(id);
        return true ;
    }

    // payout in middle or in case of APPROVED 
    function projectPayout(uint id)public returns(bool){
        require( projects[id].status == statusEnum.APPROVED , "Not Approved yet" );
        require( msg.sender == projects[id].owner || msg.sender == owner , "Unauthorised User" );

        performPayout(id);
        return true ;
    }

    function payTo( address to , uint256 amount ) internal {
        ( bool success, ) = payable(to).call{ value :amount}("");
       require(success); 
    }

    function changeTax(uint _tax) public ownerOnly {
        projectTax = _tax;
    }

    function getProject(uint id) public view returns (projectStruct memory) {
        require(projectExist[id], "Project not found");
        return projects[id];
    }

    function getProjects() public view returns (projectStruct[] memory) {
        return projects;
    }

    function getBackers(uint id) public view returns (backerStruct[] memory) {
        return backersof[id] ;
    }   
}
