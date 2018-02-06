import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccessService } from './Access.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Access',
	templateUrl: './Access.component.html',
	styleUrls: ['./Access.component.css'],
  providers: [AccessService]
})
export class AccessComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          fileID = new FormControl("", Validators.required);
        
  
      
          accessList = new FormControl("", Validators.required);
        
  
      
          accesses = new FormControl("", Validators.required);
        
  
      
          blockedAccess = new FormControl("", Validators.required);
        
  
      
          fileOwner = new FormControl("", Validators.required);
        
  


  constructor(private serviceAccess:AccessService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          fileID:this.fileID,
        
    
        
          accessList:this.accessList,
        
    
        
          accesses:this.accesses,
        
    
        
          blockedAccess:this.blockedAccess,
        
    
        
          fileOwner:this.fileOwner
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceAccess.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.biznet.Access",
      
        
          "fileID":this.fileID.value,
        
      
        
          "accessList":this.accessList.value,
        
      
        
          "accesses":this.accesses.value,
        
      
        
          "blockedAccess":this.blockedAccess.value,
        
      
        
          "fileOwner":this.fileOwner.value
        
      
    };

    this.myForm.setValue({
      
        
          "fileID":null,
        
      
        
          "accessList":null,
        
      
        
          "accesses":null,
        
      
        
          "blockedAccess":null,
        
      
        
          "fileOwner":null
        
      
    });

    return this.serviceAccess.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "fileID":null,
        
      
        
          "accessList":null,
        
      
        
          "accesses":null,
        
      
        
          "blockedAccess":null,
        
      
        
          "fileOwner":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.biznet.Access",
      
        
          
        
    
        
          
            "accessList":this.accessList.value,
          
        
    
        
          
            "accesses":this.accesses.value,
          
        
    
        
          
            "blockedAccess":this.blockedAccess.value,
          
        
    
        
          
            "fileOwner":this.fileOwner.value
          
        
    
    };

    return this.serviceAccess.updateAsset(form.get("fileID").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceAccess.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceAccess.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "fileID":null,
          
        
          
            "accessList":null,
          
        
          
            "accesses":null,
          
        
          
            "blockedAccess":null,
          
        
          
            "fileOwner":null 
          
        
      };



      
        if(result.fileID){
          
            formObject.fileID = result.fileID;
          
        }else{
          formObject.fileID = null;
        }
      
        if(result.accessList){
          
            formObject.accessList = result.accessList;
          
        }else{
          formObject.accessList = null;
        }
      
        if(result.accesses){
          
            formObject.accesses = result.accesses;
          
        }else{
          formObject.accesses = null;
        }
      
        if(result.blockedAccess){
          
            formObject.blockedAccess = result.blockedAccess;
          
        }else{
          formObject.blockedAccess = null;
        }
      
        if(result.fileOwner){
          
            formObject.fileOwner = result.fileOwner;
          
        }else{
          formObject.fileOwner = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "fileID":null,
        
      
        
          "accessList":null,
        
      
        
          "accesses":null,
        
      
        
          "blockedAccess":null,
        
      
        
          "fileOwner":null 
        
      
      });
  }

}
