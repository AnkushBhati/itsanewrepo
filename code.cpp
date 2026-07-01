#include <iostream>
using namespace std;

int binaryToDecimal(int n){ 
  int ans = 0;
  int pow = 1;
  while(n>0){
   int rem = n%10;
    n = n/10;
    ans += (rem*pow);
    pow *= 2; 
  }

  return ans;
}

int main(){
  cout << binaryToDecimal(11001) << endl;
  return 0;
}


